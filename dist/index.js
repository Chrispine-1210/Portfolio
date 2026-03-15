var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/replit_integrations/auth/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";

// shared/models/auth.ts
import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  replitSub: varchar("replit_sub").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isPremium: boolean("is_premium").default(false),
  isAdmin: boolean("is_admin").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  replitSub: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogComments: () => blogComments,
  blogLikes: () => blogLikes,
  blogPosts: () => blogPosts,
  contactRequests: () => contactRequests,
  emailTemplates: () => emailTemplates,
  externalPosts: () => externalPosts,
  insertBlogCommentSchema: () => insertBlogCommentSchema,
  insertBlogLikeSchema: () => insertBlogLikeSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertContactRequestSchema: () => insertContactRequestSchema,
  insertEmailTemplateSchema: () => insertEmailTemplateSchema,
  insertExternalPostSchema: () => insertExternalPostSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  insertPortfolioProjectSchema: () => insertPortfolioProjectSchema,
  insertUserSchema: () => insertUserSchema,
  newsletterSubscribers: () => newsletterSubscribers,
  portfolioProjects: () => portfolioProjects,
  sessions: () => sessions,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users
});
import { sql as sql2 } from "drizzle-orm";
import {
  index as index2,
  pgTable as pgTable2,
  text,
  timestamp as timestamp2,
  varchar as varchar2,
  boolean as boolean2,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";
var blogPosts = pgTable2("blog_posts", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags").array().default(sql2`ARRAY[]::text[]`),
  isPremium: boolean2("is_premium").default(false),
  isPublished: boolean2("is_published").default(true),
  readTimeMinutes: integer("read_time_minutes").default(5),
  publishedAt: timestamp2("published_at").defaultNow(),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
}, (table) => ({
  categoryIdx: index2("blog_category_idx").on(table.category),
  publishedIdx: index2("blog_published_idx").on(table.isPublished),
  publishedAtIdx: index2("blog_published_at_idx").on(table.publishedAt),
  slugIdx: index2("blog_slug_idx").on(table.slug)
}));
var insertBlogPostSchema = createInsertSchema2(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});
var portfolioProjects = pgTable2("portfolio_projects", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  challenge: text("challenge"),
  solution: text("solution"),
  outcome: text("outcome"),
  category: text("category").notNull(),
  techStack: text("tech_stack").array().default(sql2`ARRAY[]::text[]`),
  featuredImage: text("featured_image"),
  images: text("images").array().default(sql2`ARRAY[]::text[]`),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  featured: boolean2("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
}, (table) => ({
  categoryIdx: index2("portfolio_category_idx").on(table.category),
  featuredIdx: index2("portfolio_featured_idx").on(table.featured),
  slugIdx: index2("portfolio_slug_idx").on(table.slug),
  orderIdx: index2("portfolio_order_idx").on(table.order)
}));
var insertPortfolioProjectSchema = createInsertSchema2(portfolioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var newsletterSubscribers = pgTable2("newsletter_subscribers", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  email: varchar2("email").notNull().unique(),
  name: text("name"),
  isActive: boolean2("is_active").default(true),
  subscribedAt: timestamp2("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp2("unsubscribed_at")
});
var insertNewsletterSubscriberSchema = createInsertSchema2(newsletterSubscribers).pick({
  email: true,
  name: true
});
var contactRequests = pgTable2("contact_requests", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  name: text("name").notNull(),
  email: varchar2("email").notNull(),
  projectType: text("project_type"),
  // Consultation, Development, MEL Implementation, Training
  message: text("message").notNull(),
  preferredContact: text("preferred_contact"),
  // Email, Phone, WhatsApp
  isRead: boolean2("is_read").default(false),
  createdAt: timestamp2("created_at").defaultNow()
});
var insertContactRequestSchema = createInsertSchema2(contactRequests).omit({
  id: true,
  isRead: true,
  createdAt: true
});
var blogLikes = pgTable2("blog_likes", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  blogPostId: varchar2("blog_post_id").notNull(),
  userId: varchar2("user_id").notNull(),
  createdAt: timestamp2("created_at").defaultNow()
});
var insertBlogLikeSchema = createInsertSchema2(blogLikes).omit({
  id: true,
  createdAt: true
});
var blogComments = pgTable2("blog_comments", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  blogPostId: varchar2("blog_post_id").notNull(),
  userId: varchar2("user_id").notNull(),
  parentId: varchar2("parent_id"),
  // For replies
  content: text("content").notNull(),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var insertBlogCommentSchema = createInsertSchema2(blogComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var emailTemplates = pgTable2("email_templates", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  templateImage: text("template_image"),
  marketingTips: text("marketing_tips"),
  category: text("category"),
  // weekly, monthly, promotional
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var insertEmailTemplateSchema = createInsertSchema2(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var externalPosts = pgTable2("external_posts", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  title: text("title").notNull(),
  source: text("source").notNull(),
  // LinkedIn, Medium, Dev.to, etc
  url: text("url").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  publishedAt: timestamp2("published_at"),
  category: text("category"),
  // MEL, Programming, Career
  embedCode: text("embed_code"),
  // For embedded widgets
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var insertExternalPostSchema = createInsertSchema2(externalPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/replit_integrations/auth/storage.ts
import { eq } from "drizzle-orm";
var AuthStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
};
var authStorage = new AuthStorage();

// server/replit_integrations/auth/replitAuth.ts
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["picture"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const claims = tokens.claims();
    if (!claims) {
      return verified(new Error("No claims found in tokens"));
    }
    const user = {
      claims: {
        sub: claims.sub,
        email: claims.email,
        given_name: claims.given_name,
        family_name: claims.family_name,
        picture: claims.picture
      },
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: claims.exp
    };
    await upsertUser(claims);
    verified(null, user);
  };
  const registeredStrategies = /* @__PURE__ */ new Set();
  const ensureStrategy = (domain) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/replit_integrations/auth/routes.ts
function registerAuthRoutes(app2) {
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

// server/custom-auth.ts
import crypto from "crypto";
var SECRET = process.env.AUTH_SECRET || "your-super-secret-key-change-in-prod";
var ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
function generateToken(email, isAdmin) {
  const payload = JSON.stringify({ email, isAdmin, iat: Date.now() });
  const encoded = Buffer.from(payload).toString("base64");
  const signature = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}
function verifyToken(token) {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64").toString());
    return payload;
  } catch {
    return null;
  }
}
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
function setupAuthRoutes(router2) {
  router2.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (email !== ADMIN_EMAIL) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (hashPassword(password) !== hashPassword(ADMIN_PASSWORD)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(email, true);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      res.json({ message: "Login successful", token, user: { email, isAdmin: true } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  router2.get("/api/auth/me", (req, res) => {
    try {
      const token = req.cookies?.authToken || req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.json(null);
      }
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.json(null);
      }
      res.json({ id: decoded.email, email: decoded.email, isAdmin: decoded.isAdmin });
    } catch {
      res.json(null);
    }
  });
  router2.post("/api/auth/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
  });
}

// server/analytics.ts
var Analytics = class {
  events = [];
  maxEvents = 1e3;
  recordEvent(event) {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }
  getEvents(filter) {
    let filtered = [...this.events];
    if (filter?.type) {
      filtered = filtered.filter((e) => e.eventType === filter.type);
    }
    if (filter?.hours) {
      const cutoff = new Date(Date.now() - filter.hours * 60 * 60 * 1e3);
      filtered = filtered.filter((e) => e.timestamp > cutoff);
    }
    return filtered;
  }
  getStats() {
    const recentEvents = this.getEvents({ hours: 24 });
    const errorCount = recentEvents.filter((e) => e.error).length;
    const totalRequests = recentEvents.length;
    const avgResponseTime = recentEvents.length > 0 ? recentEvents.reduce((sum, e) => sum + e.duration, 0) / recentEvents.length : 0;
    return {
      totalRequests,
      errorCount,
      avgResponseTime: Math.round(avgResponseTime),
      errorRate: totalRequests > 0 ? (errorCount / totalRequests * 100).toFixed(2) + "%" : "0%",
      lastUpdated: /* @__PURE__ */ new Date()
    };
  }
  reset() {
    this.events = [];
  }
};
var analytics = new Analytics();
function analyticsMiddleware(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    analytics.recordEvent({
      eventType: req.path.startsWith("/api") ? "API_REQUEST" : "PAGE_VIEW",
      route: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: /* @__PURE__ */ new Date(),
      userId: req.user?.id,
      error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : void 0
    });
  });
  next();
}

// server/api-analytics.ts
function setupAnalyticsRoutes(router2) {
  router2.get("/api/analytics/stats", (req, res) => {
    try {
      const stats = analytics.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  router2.get("/api/analytics/events", (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours) : 24;
      const events = analytics.getEvents({ hours }).slice(-50);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  router2.get("/api/analytics/events/type/:type", (req, res) => {
    try {
      const { type } = req.params;
      const events = analytics.getEvents({ type });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
}

// server/seed-data.ts
var seedBlogPosts = [
  {
    title: "LoRaWAN in IoT: Deep Technical Analysis",
    slug: "lorawan-iot-deep-dive",
    excerpt: "Comprehensive exploration of LoRaWAN protocol architecture, performance optimization, and real-world deployment strategies.",
    content: `# LoRaWAN in IoT: Deep Technical Analysis

## Introduction
LoRaWAN represents a paradigm shift in long-range, low-power wireless communication for the Internet of Things. This deep dive explores the technical architecture, implementation strategies, and optimization techniques critical for successful deployments.

## Protocol Architecture

### Physical Layer (PHY)
- **Frequency Bands**: 868 MHz (EU), 915 MHz (US), 923 MHz (AS), regional variations
- **Bandwidth**: 125 kHz, 250 kHz, 500 kHz (FSK mode)
- **Spreading Factor**: SF7-SF12 (Range vs Data Rate trade-off)
- **Coding Rate**: 4/5, 4/6, 4/7, 4/8
- **Modulation**: LoRa (proprietary) for long-range, FSK for high data rate

### Data Rate Calculation
\`\`\`
DR = SF * BW / 2^SF
Example: SF7, 125kHz = 7 * 125,000 / 128 = 6,836 bps \u2248 6.8 kbps
\`\`\`

## Hardware Engineering Considerations

### Transceiver Selection
- **SX1272/73**: Low cost, proven in production environments
- **SX1276/77/78**: Enhanced performance, better sensitivity (-134 dBm)
- **LR1110**: Integrated GNSS, ultra-low power, multi-band
- **SX1280**: 2.4 GHz band, higher data rates, shorter range

### Power Budget Analysis
- Transmit Power: 2-20 dBm (typical: 14 dBm)
- Receiver Sensitivity: -137 to -130 dBm (depending on SF)
- Minimum Power Loss: Path Loss < Transmit Power - Sensitivity + Margin (10-15 dB)
- Link Budget = TX Power - Path Loss - Fading Margin = Minimum RX Sensitivity

### Antenna Design
- **Omni-directional**: \xBC wave (17 cm @ 868 MHz), gain \u2248 2 dBi
- **Directional arrays**: Yagi or patch for targeted deployment
- **Impedance matching**: Critical for >90% efficiency
- **Cable loss**: -0.2 dB/m typical coaxial cable

## Real-World Deployment Patterns

### Gateway Architecture
- **Multi-channel reception**: Simultaneous monitoring of 8+ channels
- **Backhaul options**: WiFi, Ethernet, Cellular (LTE-M, NB-IoT)
- **Processing strategy**: Local filtering vs Cloud processing trade-offs
- **Redundancy**: Multiple gateways for coverage overlap and fault tolerance

### Network Optimization
- **Adaptive Data Rate (ADR)**: Automatic SF/DR adjustment based on link quality
- **Duty cycle compliance**: Sub-band limitations (1% airtime in EU, 0.1% in specific bands)
- **Link budget calculation**: Margin planning for seasonal/environmental variations
- **Time synchronization**: GPS or NTP for gateway coordination

### Interference Management
- **Collision avoidance**: Random backoff (0-2s typical)
- **Capture effect**: Strong signal can suppress weaker signals
- **Friis formula**: TX power + TX antenna gain - path loss - RX antenna gain
- **Co-channel mitigation**: Frequency hopping, different SFs

## Advanced Topics

### Encryption & Security
- **Network Session Key (NwkSKey)**: Network-level encryption
- **Application Session Key (AppSKey)**: Application-level encryption
- **Join Procedure**: OTAA (Over-The-Air Activation) vs ABP (Activation By Personalization)
- **DevNonce & JoinNonce**: Preventing replay attacks

### Performance Benchmarks

| Spreading Factor | Range (ideal) | Data Rate | Airtime (51B) | Symbol Time |
|---|---|---|---|---|
| SF7 | 2-5 km | 5.47 kbps | 41 ms | 1 ms |
| SF9 | 5-10 km | 1.37 kbps | 163 ms | 4 ms |
| SF12 | 10-15 km | 0.29 kbps | 1,648 ms | 32 ms |

## Practical Implementation Guide

### Device Code Example (Pseudo)
\`\`\`
1. Initialize radio chip (SPI config)
2. Configure frequency and spreading factor
3. Set TX power and modulation
4. Implement state machine (idle, TX, RX, sleep)
5. Handle acknowledgments and retransmission
6. Manage battery and power states
\`\`\`

## Conclusion
Successful LoRaWAN deployments require deep understanding of the protocol stack, careful hardware selection, rigorous network design, and continuous optimization based on real-world conditions.`,
    category: "Hardware Engineering",
    tags: ["IoT", "LoRaWAN", "Networking", "Hardware", "RF Design", "Wireless"],
    readTimeMinutes: 18
  },
  {
    title: "MEL Systems: Monitoring Framework Deep Dive",
    slug: "mel-monitoring-framework",
    excerpt: "Advanced methodological insights into designing, implementing, and validating comprehensive Monitoring, Evaluation, and Learning systems.",
    content: `# MEL Systems: Monitoring Framework Deep Dive

## Core MEL Principles

### Monitoring
- **Definition**: Ongoing systematic collection and analysis of data on program implementation
- **Frequency**: Real-time, daily, weekly, monthly depending on indicators
- **Data Quality**: Validation rules, error checking, source verification
- **Responsibility**: Field teams, supervisors, data managers

### Evaluation
- **Formative**: Ongoing process improvement (Baseline \u2192 Midline \u2192 Endline)
- **Summative**: Impact assessment and outcome validation
- **Counterfactual**: Understanding what would have happened without intervention
- **Rigor Levels**: Descriptive, quasi-experimental, experimental

### Learning
- **Knowledge Management**: Documenting insights and lessons learned
- **Adaptive Management**: Using data to adjust strategies in real-time
- **Knowledge Sharing**: Communicating findings to stakeholders
- **Continuous Improvement**: Iterative cycles of action and reflection

## Data Flow Architecture

\`\`\`
Program Theory of Change
    \u2193
Indicator Identification (Impact/Outcome/Output/Process)
    \u2193
Data Collection Design (Primary/Secondary Sources)
    \u2193
Data Collection & Entry (ODK, KoboToolbox, direct surveys)
    \u2193
Data Validation & Cleaning (QA checks, outlier analysis)
    \u2193
Analysis & Interpretation (Descriptive, correlative, causal)
    \u2193
Reporting & Visualization (Dashboards, reports, briefs)
    \u2193
Learning & Decision-Making (Stakeholder workshops, strategy sessions)
    \u2193
Program Adjustment & Iteration
\`\`\`

## Indicator Design Framework

### SMART Criteria
- **Specific**: Clear, unambiguous definition with operational guidance
- **Measurable**: Quantifiable or observable with specific units
- **Achievable**: Realistic within program context and resources
- **Relevant**: Directly tied to program objectives and outcomes
- **Time-bound**: Collection schedule clearly defined

### Indicator Hierarchy
1. **Impact Indicators** (Long-term, 3-5 years): Societal-level change
2. **Outcome Indicators** (Medium-term, 1-2 years): Behavioral/institutional change
3. **Output Indicators** (Short-term, 6-12 months): Direct deliverables
4. **Process Indicators** (Operational, monthly): Implementation fidelity

### Data Quality Dimensions
- **Accuracy**: Data reflects true values
- **Completeness**: All required data collected
- **Timeliness**: Data available when needed
- **Consistency**: Data aligns across sources
- **Validity**: Measurement captures intended construct

## Data Management Systems

### Collection Methods
- **Direct surveys**: Face-to-face interviews (high cost, high quality)
- **Administrative data**: Existing records (low cost, potential bias)
- **Remote sensing**: Satellite imagery, GIS analysis
- **Mobile data collection**: ODK, KoboToolbox, CommCare
- **Focus groups**: Qualitative insights on barriers and enablers

### Quality Assurance Protocol
- Field verification protocols (spot-check 10-20% of surveys)
- Double entry verification (2 independent data entry operators)
- Outlier detection (statistical analysis, contextual review)
- Completeness and timeliness checks (dashboard monitoring)
- Source triangulation (cross-referencing multiple sources)

## Analysis Techniques

### Quantitative
- Descriptive statistics (mean, median, SD, distribution)
- Trend analysis (time series, growth rates)
- Correlation analysis (relationship strength)
- Difference-in-differences (causal inference)
- Regression models (controlling for confounders)

### Qualitative
- Thematic coding (pattern identification)
- Content analysis (frequency of themes)
- Narrative analysis (story-based understanding)
- Framework analysis (structured interpretation)

## Reporting & Visualization
- Dashboard design (real-time monitoring)
- Data storytelling (narrative + visuals)
- Infographics (key findings at a glance)
- Interactive tools (stakeholder engagement)
- Brief formats (1-pagers for quick decision-making)`,
    category: "MEL Systems",
    tags: ["Monitoring", "Evaluation", "Learning", "Data Management", "Program Design"],
    readTimeMinutes: 16
  }
];
var seedPortfolioProjects = [
  {
    title: "Smart Gateway Infrastructure System",
    slug: "smart-gateway-infrastructure",
    description: "Enterprise-grade IoT gateway system supporting LoRaWAN, LTE-M, and NB-IoT with real-time processing and cloud integration.",
    challenge: "Design a scalable gateway architecture that handles 1000+ concurrent sensor connections with sub-second latency, manages duty cycle compliance, and provides redundancy across multiple connectivity options.",
    solution: "Implemented multi-radio gateway with adaptive frequency selection, local edge processing for critical alerts, cloud sync for analytics, and automatic failover between cellular and WiFi backhaul. Built custom firmware using C++ with RTOS scheduling.",
    outcome: "Deployed across 5 regional networks, processing 50M+ messages/month with 99.9% uptime. Reduced latency from 3s to 200ms. Saved 40% on cellular costs through intelligent traffic shaping.",
    category: "Infrastructure",
    techStack: ["C++", "RTOS", "LoRaWAN", "LTE-M", "NB-IoT", "PostgreSQL", "Docker"],
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f70504504?w=800",
      "https://images.unsplash.com/photo-1579440236e312515ee341e7eaf8557e11184d5f8b4f8f8f?w=800"
    ],
    featured: true,
    order: 1
  },
  {
    title: "MEL Monitoring Dashboard System",
    slug: "mel-monitoring-dashboard",
    description: "Real-time data collection and visualization platform for development programs with offline-first mobile app and web analytics dashboard.",
    challenge: "Build a system that works in areas with poor connectivity, supports 20+ concurrent data collectors, enforces data quality validation, and provides actionable insights to program managers.",
    solution: "Developed React/Node.js stack with local-first database (PouchDB), real-time sync queue, automated validation rules engine, and responsive dashboard. Integrated GIS mapping for spatial analysis.",
    outcome: "Deployed in 3 countries across 12 programs. 500+ data collectors. Reduced data entry errors by 85% through validation. Processing 2000+ data points daily with 95%+ accuracy.",
    category: "MEL Systems",
    techStack: ["React", "Node.js", "PouchDB", "PostgreSQL", "Mapbox", "D3.js"],
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
    ],
    featured: true,
    order: 2
  },
  {
    title: "5G Network Optimization Engine",
    slug: "5g-network-optimization",
    description: "Machine learning-powered system for real-time 5G network optimization, predictive maintenance, and resource allocation.",
    challenge: "Process massive volume of network telemetry (1M+ events/minute), predict failures 24 hours in advance, optimize radio resource allocation across 100+ cell sites.",
    solution: "Implemented Python/ML pipeline with time-series forecasting (Prophet, LSTM), reinforcement learning for resource allocation, and real-time optimization engine. Stream processing with Kafka.",
    outcome: "Improved network availability to 99.95%. Reduced maintenance costs by 35%. Decreased network congestion by 28%. Processed 30B+ events monthly with sub-minute latency.",
    category: "Infrastructure",
    techStack: ["Python", "TensorFlow", "Kafka", "Spark", "PostgreSQL", "Kubernetes"],
    images: [
      "https://images.unsplash.com/photo-1518611505868-48510c2e2e38?w=800",
      "https://images.unsplash.com/photo-1551434678-e076c8e7f1d4?w=800"
    ],
    featured: true,
    order: 3
  },
  {
    title: "LoRaWAN Hardware Reference Design",
    slug: "lorawan-hardware-design",
    description: "Production-ready LoRaWAN end-device reference design with ultra-low power consumption and extended range capabilities.",
    challenge: "Design a multiplatform IoT device achieving >10 year battery life on AA batteries while supporting multiple sensors and over 25km range in open terrain.",
    solution: "Custom PCB design with SX1276 radio, STM32L0 MCU, and optimized power management. Implemented dynamic spreading factor adjustment, sleep mode orchestration, and flash-based configuration.",
    outcome: "Validated design across 5000+ field deployments. Average battery life: 12 years. Max range achieved: 28km. Cost: $35/unit in volume. Successfully licensed to 3 manufacturers.",
    category: "Hardware Engineering",
    techStack: ["ARM Cortex-M0", "LoRaWAN", "C/C++", "KiCad", "RF Design"],
    liveUrl: "https://github.com/projects/lorawan-hardware",
    featured: false,
    order: 4
  }
];

// server/content-seeder.ts
function setupSeedRoutes(router2) {
  router2.get("/api/content/blogs/seed", (req, res) => {
    try {
      res.json({ blogs: seedBlogPosts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seed blogs" });
    }
  });
  router2.get("/api/content/projects/seed", (req, res) => {
    try {
      res.json({ projects: seedPortfolioProjects });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seed projects" });
    }
  });
}

// server/storage.ts
import { Pool as Pool2 } from "@neondatabase/serverless";
import { drizzle as drizzle2 } from "drizzle-orm/neon-serverless";
import { eq as eq2, desc, and } from "drizzle-orm";
var pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
var db2 = drizzle2(pool2);
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const result = await db2.select().from(users).where(eq2(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByReplitSub(sub) {
    const result = await db2.select().from(users).where(eq2(users.replitSub, sub)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db2.select().from(users).where(eq2(users.email, email)).limit(1);
    return result[0];
  }
  async createUser(data) {
    const result = await db2.insert(users).values({
      ...data,
      isAdmin: data.email === "chrispinemndala@gmail.com"
      // Set initial admin
    }).returning();
    return result[0];
  }
  async updateUser(id, data) {
    const result = await db2.update(users).set(data).where(eq2(users.id, id)).returning();
    return result[0];
  }
  async updateUserPremiumStatus(id, isPremium, stripeSubscriptionId) {
    const result = await db2.update(users).set({ isPremium, stripeSubscriptionId }).where(eq2(users.id, id)).returning();
    return result[0];
  }
  // Blog Posts
  async getAllBlogPosts() {
    return await db2.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }
  async getPublishedBlogPosts() {
    return await db2.select().from(blogPosts).where(eq2(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
  }
  async getRecentBlogPosts(limit = 6) {
    return await db2.select().from(blogPosts).where(eq2(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt)).limit(limit);
  }
  async getBlogPostBySlug(slug) {
    const result = await db2.select().from(blogPosts).where(eq2(blogPosts.slug, slug)).limit(1);
    return result[0];
  }
  async createBlogPost(data) {
    const result = await db2.insert(blogPosts).values(data).returning();
    return result[0];
  }
  async updateBlogPost(id, data) {
    const result = await db2.update(blogPosts).set(data).where(eq2(blogPosts.id, id)).returning();
    return result[0];
  }
  async deleteBlogPost(id) {
    await db2.delete(blogPosts).where(eq2(blogPosts.id, id));
  }
  // Portfolio Projects
  async getAllProjects() {
    return await db2.select().from(portfolioProjects).orderBy(desc(portfolioProjects.featured), desc(portfolioProjects.id));
  }
  async getFeaturedProjects() {
    return await db2.select().from(portfolioProjects).where(eq2(portfolioProjects.featured, true)).orderBy(desc(portfolioProjects.id));
  }
  async getProjectBySlug(slug) {
    const result = await db2.select().from(portfolioProjects).where(eq2(portfolioProjects.slug, slug)).limit(1);
    return result[0];
  }
  async createProject(data) {
    const result = await db2.insert(portfolioProjects).values(data).returning();
    return result[0];
  }
  async updateProject(id, data) {
    const result = await db2.update(portfolioProjects).set(data).where(eq2(portfolioProjects.id, id)).returning();
    return result[0];
  }
  async deleteProject(id) {
    await db2.delete(portfolioProjects).where(eq2(portfolioProjects.id, id));
  }
  // Newsletter
  async getNewsletterSubscribers() {
    return await db2.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  }
  async getNewsletterSubscriberByEmail(email) {
    const result = await db2.select().from(newsletterSubscribers).where(eq2(newsletterSubscribers.email, email)).limit(1);
    return result[0];
  }
  async createNewsletterSubscriber(data) {
    const result = await db2.insert(newsletterSubscribers).values(data).returning();
    return result[0];
  }
  async updateNewsletterSubscriberStatus(email, isActive) {
    const result = await db2.update(newsletterSubscribers).set({ isActive }).where(eq2(newsletterSubscribers.email, email)).returning();
    return result[0];
  }
  // Contact Requests
  async getAllContactRequests() {
    return await db2.select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
  }
  async getContactRequest(id) {
    const result = await db2.select().from(contactRequests).where(eq2(contactRequests.id, id)).limit(1);
    return result[0];
  }
  async createContactRequest(data) {
    const result = await db2.insert(contactRequests).values(data).returning();
    return result[0];
  }
  async updateContactRequestStatus(id, isRead) {
    const result = await db2.update(contactRequests).set({ isRead }).where(eq2(contactRequests.id, id)).returning();
    return result[0];
  }
  // Blog Engagement Implementation
  async getBlogLikes(blogPostId) {
    const result = await db2.select().from(blogLikes).where(eq2(blogLikes.blogPostId, blogPostId));
    return result.length;
  }
  async getUserBlogLike(blogPostId, userId) {
    const [like2] = await db2.select().from(blogLikes).where(and(eq2(blogLikes.blogPostId, blogPostId), eq2(blogLikes.userId, userId))).limit(1);
    return like2;
  }
  async toggleBlogLike(blogPostId, userId) {
    const existing = await this.getUserBlogLike(blogPostId, userId);
    if (existing) {
      await db2.delete(blogLikes).where(eq2(blogLikes.id, existing.id));
    } else {
      await db2.insert(blogLikes).values({ blogPostId, userId });
    }
  }
  async getBlogComments(blogPostId) {
    const comments = await db2.select({
      comment: blogComments,
      user: users
    }).from(blogComments).innerJoin(users, eq2(blogComments.userId, users.id)).where(eq2(blogComments.blogPostId, blogPostId)).orderBy(desc(blogComments.createdAt));
    return comments.map((c) => ({
      ...c.comment,
      user: c.user
    }));
  }
  async createBlogComment(data) {
    const [comment] = await db2.insert(blogComments).values(data).returning();
    return comment;
  }
  async deleteBlogComment(id, userId) {
    await db2.delete(blogComments).where(and(eq2(blogComments.id, id), eq2(blogComments.userId, userId)));
  }
  // Email Templates
  async getEmailTemplates() {
    return await db2.select().from(emailTemplates).orderBy(desc(emailTemplates.createdAt));
  }
  async getActiveEmailTemplates() {
    return await db2.select().from(emailTemplates).where(eq2(emailTemplates.isActive, true)).orderBy(desc(emailTemplates.createdAt));
  }
  async getEmailTemplate(id) {
    const result = await db2.select().from(emailTemplates).where(eq2(emailTemplates.id, id)).limit(1);
    return result[0];
  }
  async createEmailTemplate(data) {
    const result = await db2.insert(emailTemplates).values(data).returning();
    return result[0];
  }
  async updateEmailTemplate(id, data) {
    const result = await db2.update(emailTemplates).set(data).where(eq2(emailTemplates.id, id)).returning();
    return result[0];
  }
  async deleteEmailTemplate(id) {
    await db2.delete(emailTemplates).where(eq2(emailTemplates.id, id));
  }
  // External Posts
  async getExternalPosts() {
    return await db2.select().from(externalPosts).orderBy(desc(externalPosts.publishedAt));
  }
  async getActiveExternalPosts() {
    return await db2.select().from(externalPosts).where(eq2(externalPosts.isActive, true)).orderBy(desc(externalPosts.publishedAt));
  }
  async getExternalPostsByCategory(category) {
    return await db2.select().from(externalPosts).where(and(eq2(externalPosts.isActive, true), eq2(externalPosts.category, category))).orderBy(desc(externalPosts.publishedAt));
  }
  async createExternalPost(data) {
    const result = await db2.insert(externalPosts).values(data).returning();
    return result[0];
  }
  async updateExternalPost(id, data) {
    const result = await db2.update(externalPosts).set(data).where(eq2(externalPosts.id, id)).returning();
    return result[0];
  }
  async deleteExternalPost(id) {
    await db2.delete(externalPosts).where(eq2(externalPosts.id, id));
  }
};
var storage = new DatabaseStorage();

// server/advanced-filtering.ts
function setupFilteringRoutes(router2) {
  router2.get("/api/blog/search", async (req, res) => {
    try {
      const {
        q = "",
        category = "",
        page = "1",
        limit = "12",
        sort = "newest"
      } = req.query;
      let posts = await storage.getPublishedBlogPosts();
      if (q && typeof q === "string") {
        const searchLower = q.toLowerCase();
        posts = posts.filter(
          (p) => p.title.toLowerCase().includes(searchLower) || p.excerpt.toLowerCase().includes(searchLower) || (p.tags || []).some(
            (tag) => tag.toLowerCase().includes(searchLower)
          )
        );
      }
      if (category && typeof category === "string" && category !== "All") {
        posts = posts.filter((p) => p.category === category);
      }
      if (sort === "oldest") {
        posts.sort(
          (a, b) => new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime()
        );
      } else {
        posts.sort(
          (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
        );
      }
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
      const startIdx = (pageNum - 1) * limitNum;
      const paginatedPosts = posts.slice(startIdx, startIdx + limitNum);
      res.json({
        data: paginatedPosts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: posts.length,
          totalPages: Math.ceil(posts.length / limitNum),
          hasNextPage: startIdx + limitNum < posts.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });
  router2.get("/api/portfolio/search", async (req, res) => {
    try {
      const {
        q = "",
        category = "",
        page = "1",
        limit = "12",
        featured = ""
      } = req.query;
      let projects = await storage.getAllProjects();
      if (q && typeof q === "string") {
        const searchLower = q.toLowerCase();
        projects = projects.filter(
          (p) => p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower) || (p.techStack || []).some(
            (tech) => tech.toLowerCase().includes(searchLower)
          )
        );
      }
      if (category && typeof category === "string" && category !== "All") {
        projects = projects.filter((p) => p.category === category);
      }
      if (featured === "true") {
        projects = projects.filter((p) => p.featured);
      }
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
      const startIdx = (pageNum - 1) * limitNum;
      const paginatedProjects = projects.slice(startIdx, startIdx + limitNum);
      res.json({
        data: paginatedProjects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: projects.length,
          totalPages: Math.ceil(projects.length / limitNum),
          hasNextPage: startIdx + limitNum < projects.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });
  router2.get("/api/categories/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      const categories = Array.from(
        new Set(posts.map((p) => p.category))
      ).sort();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  router2.get(
    "/api/categories/portfolio",
    async (req, res) => {
      try {
        const projects = await storage.getAllProjects();
        const categories = Array.from(
          new Set(projects.map((p) => p.category))
        ).sort();
        res.json({ categories });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" });
      }
    }
  );
}

// server/logger.ts
var Logger = class {
  level = 1 /* INFO */;
  setLevel(level) {
    this.level = level;
  }
  formatMessage(logLevel, message, data) {
    const timestamp3 = (/* @__PURE__ */ new Date()).toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
    return `[${timestamp3}] [${logLevel}] ${message}${dataStr}`;
  }
  debug(message, data) {
    if (this.level <= 0 /* DEBUG */) {
      console.log(this.formatMessage("DEBUG", message, data));
    }
  }
  info(message, data) {
    if (this.level <= 1 /* INFO */) {
      console.log(this.formatMessage("INFO", message, data));
    }
  }
  warn(message, data) {
    if (this.level <= 2 /* WARN */) {
      console.warn(this.formatMessage("WARN", message, data));
    }
  }
  error(message, error) {
    if (this.level <= 3 /* ERROR */) {
      console.error(this.formatMessage("ERROR", message, error?.message || error));
    }
  }
};
var logger = new Logger();

// server/seed-trigger.ts
function setupSeedTriggerRoutes(router2) {
  router2.post("/api/admin/seed-database", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const results = {
        blogsAdded: 0,
        projectsAdded: 0,
        errors: []
      };
      for (const blog of seedBlogPosts) {
        try {
          const existing = await storage.getBlogPostBySlug(blog.slug);
          if (!existing) {
            await storage.createBlogPost({
              ...blog,
              publishedAt: /* @__PURE__ */ new Date(),
              isPublished: true,
              isPremium: false
            });
            results.blogsAdded++;
            logger.info(`Seeded blog: ${blog.slug}`);
          }
        } catch (error) {
          results.errors.push(`Blog ${blog.slug}: ${error}`);
          logger.error(`Failed to seed blog ${blog.slug}:`, error);
        }
      }
      for (const project of seedPortfolioProjects) {
        try {
          const existing = await storage.getProjectBySlug(project.slug);
          if (!existing) {
            await storage.createProject(project);
            results.projectsAdded++;
            logger.info(`Seeded project: ${project.slug}`);
          }
        } catch (error) {
          results.errors.push(`Project ${project.slug}: ${error}`);
          logger.error(`Failed to seed project ${project.slug}:`, error);
        }
      }
      res.json({
        message: "Database seeding completed",
        ...results
      });
    } catch (error) {
      logger.error("Database seeding failed:", error);
      res.status(500).json({ message: "Seeding failed", error });
    }
  });
  router2.get("/api/admin/seed-status", async (req, res) => {
    try {
      const blogs = await storage.getPublishedBlogPosts();
      const projects = await storage.getAllProjects();
      const seedBlogs = seedBlogPosts.map((b) => b.slug);
      const seedProjects = seedPortfolioProjects.map((p) => p.slug);
      const seededBlogs = blogs.filter((b) => seedBlogs.includes(b.slug));
      const seededProjects = projects.filter((p) => seedProjects.includes(p.slug));
      res.json({
        totalBlogsSeeded: seededBlogs.length,
        totalProjectsSeeded: seededProjects.length,
        expectedBlogs: seedBlogPosts.length,
        expectedProjects: seedPortfolioProjects.length,
        blogSlugs: seededBlogs.map((b) => b.slug),
        projectSlugs: seededProjects.map((p) => p.slug)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check seed status" });
    }
  });
}

// server/middleware.ts
var securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  next();
};
var requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
};

// server/routes.ts
import { Router } from "express";
import Stripe from "stripe";
var router = Router();
router.get("/api/user/profile", isAuthenticated, (req, res) => {
  res.json(req.user);
});
router.put("/api/user/profile", isAuthenticated, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.claims.sub;
    const updatedUser = await storage.updateUser(userId, data);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});
router.get("/api/blog", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=300");
    let posts = await storage.getPublishedBlogPosts();
    const { category, search, premium } = req.query;
    if (category && typeof category === "string") {
      posts = posts.filter((p) => p.category === category);
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(searchLower) || p.excerpt.toLowerCase().includes(searchLower) || (p.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    if (premium === "true") {
      posts = posts.filter((p) => p.isPremium);
    } else if (premium === "false") {
      posts = posts.filter((p) => !p.isPremium);
    }
    const user = req.user;
    if (!user?.claims?.sub) {
      posts = posts.map((post) => {
        if (post.isPremium) {
          const { content, ...postWithoutContent } = post;
          return postWithoutContent;
        }
        return post;
      });
    }
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});
router.get("/api/blog/recent", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;
    let posts = await storage.getRecentBlogPosts(limit);
    const user = req.user;
    if (!user?.claims?.sub) {
      posts = posts.map((post) => {
        if (post.isPremium) {
          const { content, ...postWithoutContent } = post;
          return postWithoutContent;
        }
        return post;
      });
    }
    res.json(posts);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    res.status(500).json({ message: "Failed to fetch recent posts" });
  }
});
router.get("/api/blog/:slug", async (req, res) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = req.user;
    if (post.isPremium && !user?.claims?.sub) {
      return res.status(403).json({
        message: "Premium subscription required to access this content",
        isPremium: true,
        excerpt: post.excerpt
      });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Failed to fetch blog post" });
  }
});
router.post("/api/blog", async (req, res) => {
  try {
    const data = insertBlogPostSchema.parse(req.body);
    const post = await storage.createBlogPost(data);
    res.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create blog post" });
  }
});
router.put("/api/blog/:id", async (req, res) => {
  try {
    const data = insertBlogPostSchema.partial().parse(req.body);
    const post = await storage.updateBlogPost(req.params.id, data);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update blog post" });
  }
});
router.delete("/api/blog/:id", async (req, res) => {
  try {
    await storage.deleteBlogPost(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
});
router.get("/api/portfolio", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=300");
    let projects = await storage.getAllProjects();
    const { category, search, featured } = req.query;
    if (category && typeof category === "string") {
      projects = projects.filter((p) => p.category === category);
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      projects = projects.filter(
        (p) => p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower) || (p.techStack || []).some((tech) => tech.toLowerCase().includes(searchLower))
      );
    }
    if (featured === "true") {
      projects = projects.filter((p) => p.featured);
    } else if (featured === "false") {
      projects = projects.filter((p) => !p.featured);
    }
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});
router.get("/api/portfolio/featured", async (req, res) => {
  try {
    const projects = await storage.getFeaturedProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ message: "Failed to fetch featured projects" });
  }
});
router.get("/api/portfolio/:slug", async (req, res) => {
  try {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});
router.post("/api/portfolio", async (req, res) => {
  try {
    const data = insertPortfolioProjectSchema.parse(req.body);
    const project = await storage.createProject(data);
    res.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create project" });
  }
});
router.put("/api/portfolio/:id", async (req, res) => {
  try {
    const data = insertPortfolioProjectSchema.partial().parse(req.body);
    const project = await storage.updateProject(req.params.id, data);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update project" });
  }
});
router.delete("/api/portfolio/:id", async (req, res) => {
  try {
    await storage.deleteProject(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
});
router.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const data = insertNewsletterSubscriberSchema.parse(req.body);
    const existing = await storage.getNewsletterSubscriberByEmail(data.email);
    if (existing) {
      if (!existing.isActive) {
        await storage.updateNewsletterSubscriberStatus(data.email, true);
        return res.json({ message: "Resubscribed successfully" });
      }
      return res.status(400).json({ message: "Already subscribed" });
    }
    const subscriber = await storage.createNewsletterSubscriber(data);
    res.json(subscriber);
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to subscribe" });
  }
});
router.post("/api/contact", async (req, res) => {
  try {
    const data = insertContactRequestSchema.parse(req.body);
    const request = await storage.createContactRequest(data);
    res.json(request);
  } catch (error) {
    console.error("Error creating contact request:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit contact request" });
  }
});
router.get("/api/blog/:id/likes", async (req, res) => {
  const count = await storage.getBlogLikes(req.params.id);
  const user = req.user;
  let isLiked = false;
  if (user?.claims?.sub) {
    const like2 = await storage.getUserBlogLike(req.params.id, user.claims.sub);
    isLiked = !!like2;
  }
  res.json({ count, isLiked });
});
router.post("/api/blog/:id/likes/toggle", async (req, res) => {
  const userId = req.user.claims.sub;
  await storage.toggleBlogLike(req.params.id, userId);
  const count = await storage.getBlogLikes(req.params.id);
  res.json({ count, isLiked: true });
});
router.get("/api/blog/:id/comments", async (req, res) => {
  const comments = await storage.getBlogComments(req.params.id);
  res.json(comments);
});
router.post("/api/blog/:id/comments", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const data = insertBlogCommentSchema.parse({
      ...req.body,
      blogPostId: req.params.id,
      userId
    });
    const comment = await storage.createBlogComment(data);
    res.json(comment);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to post comment" });
  }
});
router.delete("/api/blog/comments/:id", async (req, res) => {
  const userId = req.user.claims.sub;
  await storage.deleteBlogComment(req.params.id, userId);
  res.json({ success: true });
});
router.get("/api/admin/stats", async (req, res) => {
  const user = req.user;
  const dbUser = await storage.getUserByReplitSub(user.claims.sub);
  if (!dbUser?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  const posts = await storage.getAllBlogPosts();
  const subscribers = await storage.getNewsletterSubscribers();
  const contacts = await storage.getAllContactRequests();
  res.json({
    totalPosts: posts.length,
    totalSubscribers: subscribers.length,
    totalContacts: contacts.length
  });
});
router.post("/api/create-payment-intent", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Stripe not configured" });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const amount = 9;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        userId: req.user.claims.sub.toString()
      }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});
router.get("/api/email-templates", async (req, res) => {
  try {
    const templates = await storage.getActiveEmailTemplates();
    res.json(templates);
  } catch (error) {
    console.error("Error fetching email templates:", error);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});
router.post("/api/email-templates", async (req, res) => {
  try {
    const data = insertEmailTemplateSchema.parse(req.body);
    const template = await storage.createEmailTemplate(data);
    res.json(template);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create template" });
  }
});
router.get("/api/external-posts", async (req, res) => {
  try {
    const mockPosts = [
      {
        id: "1",
        title: "Building Scalable MEL Systems",
        source: "LinkedIn",
        url: "https://linkedin.com",
        excerpt: "Insights on designing robust monitoring and evaluation frameworks.",
        featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        publishedAt: /* @__PURE__ */ new Date(),
        category: "MEL",
        embedCode: null,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    res.json(mockPosts);
  } catch (error) {
    console.error("Error fetching external posts:", error);
    res.json([]);
  }
});
router.post("/api/stripe-webhook", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Stripe not configured" });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).send("Missing signature");
    }
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      await storage.updateUserPremiumStatus(userId, true);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send("Webhook error");
  }
});
var routes_default = router;

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use("/api/stripe-webhook", express2.raw({ type: "application/json" }));
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  limit: "10kb"
}));
app.use(express2.urlencoded({ extended: false, limit: "10kb" }));
app.use(securityHeaders);
app.use(requestLogger);
app.use(analyticsMiddleware);
var customAuthRouter = express2.Router();
setupAuthRoutes(customAuthRouter);
app.use(customAuthRouter);
var analyticsRouter = express2.Router();
setupAnalyticsRoutes(analyticsRouter);
app.use(analyticsRouter);
var seedRouter = express2.Router();
setupSeedRoutes(seedRouter);
app.use(seedRouter);
var filterRouter = express2.Router();
setupFilteringRoutes(filterRouter);
app.use(filterRouter);
var seedTriggerRouter = express2.Router();
setupSeedTriggerRoutes(seedTriggerRouter);
app.use(seedTriggerRouter);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await setupAuth(app);
  registerAuthRoutes(app);
})();
app.use("/attached_assets", express2.static("attached_assets"));
app.use(routes_default);
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
(async () => {
  const server = await import("http").then((mod) => mod.createServer(app));
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`Server is listening on port ${port}...`);
  });
  process.on("SIGTERM", () => {
    log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      log("HTTP server closed");
      pgPool.end();
    });
  });
})();
