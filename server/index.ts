import "dotenv/config";

import express, { type Request, type Response, type NextFunction } from "express";
import http from "http";

import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { setupAuthRoutes } from "./custom-auth";
import { analyticsMiddleware } from "./analytics";
import { setupAnalyticsRoutes } from "./api-analytics";
import { setupSeedRoutes } from "./content-seeder";
import { setupFilteringRoutes } from "./advanced-filtering";
import { setupSeedTriggerRoutes } from "./seed-trigger";
import { securityHeaders, requestLogger } from "./middleware";
import routes from "./routes";
import { setupVite, serveStatic, log } from "./vite";

declare global {
  namespace Express {
    interface User {
      claims: {
        sub: string;
        email?: string;
        given_name?: string;
        family_name?: string;
        picture?: string;
      };
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
    }
  }
}

async function main() {
  const app = express();

  // ---------- Body Parsing ----------

  app.use("/api/stripe-webhook", express.raw({ type: "application/json" }));

  app.use(express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
    limit: "10kb"
  }));

  app.use(express.urlencoded({ extended: false, limit: "10kb" }));

  // ---------- Security & Logging ----------

  app.use(securityHeaders);
  app.use(requestLogger);
  app.use(analyticsMiddleware);

  // ---------- Custom Auth (Admin) ----------

  const customAuthRouter = express.Router();
  setupAuthRoutes(customAuthRouter);
  app.use("/auth", customAuthRouter);

  // ---------- Analytics ----------

  const analyticsRouter = express.Router();
  setupAnalyticsRoutes(analyticsRouter);
  app.use("/analytics", analyticsRouter);

  // ---------- Content Tools ----------

  const seedRouter = express.Router();
  setupSeedRoutes(seedRouter);
  app.use("/seed", seedRouter);

  const filterRouter = express.Router();
  setupFilteringRoutes(filterRouter);
  app.use("/filter", filterRouter);

  const seedTriggerRouter = express.Router();
  setupSeedTriggerRoutes(seedTriggerRouter);
  app.use("/seed-trigger", seedTriggerRouter);

  // ---------- Optional Replit Auth ----------
  // Only enable if credentials exist

  if (process.env.REPLIT_CLIENT_ID) {
    await setupAuth(app);
    registerAuthRoutes(app);
  } else {
    log("Replit auth disabled (no credentials found)");
  }

  // ---------- Static Assets ----------

  app.use("/attached_assets", express.static("attached_assets"));

  // ---------- API Routes ----------

  app.use("/api", routes);

  // ---------- Error Handler ----------

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Server error:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  // ---------- HTTP Server ----------

  const server = http.createServer(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);

  const host =
    process.env.NODE_ENV === "production"
      ? "0.0.0.0"
      : "127.0.0.1";

  server.listen(port, host, () => {
    log(`🚀 Server running at http://${host}:${port}`);
  });

  // ---------- Graceful Shutdown ----------

  const shutdown = () => {
    log("Shutting down server...");
    server.close(() => {
      log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch(err => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});