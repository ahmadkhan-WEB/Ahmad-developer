import "dotenv/config";

import { createHash, randomBytes } from "node:crypto";
import cookieParser from "cookie-parser";
import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import {
  createPool,
  type Pool,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

const SESSION_COOKIE = "navisense_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const mysqlPort = Number(process.env.MYSQL_PORT);
const databaseConfigured = Boolean(
  process.env.MYSQL_HOST &&
    process.env.MYSQL_DATABASE &&
    process.env.MYSQL_USER &&
    process.env.MYSQL_PASSWORD !== undefined,
);

const pool: Pool | null = databaseConfigured
  ? createPool({
      host: process.env.MYSQL_HOST,
      port: Number.isInteger(mysqlPort) && mysqlPort > 0 ? mysqlPort : 3306,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      charset: "utf8mb4",
      connectionLimit: 10,
      waitForConnections: true,
      enableKeepAlive: true,
    })
  : null;

const app = express();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: SESSION_DURATION_MS,
};

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

function bodyRecord(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {};
  }
  return body as Record<string, unknown>;
}

function errorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

function clientErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return error.status;
  }
  return undefined;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function setSessionCookie(response: Response, token: string): void {
  response.cookie(SESSION_COOKIE, token, cookieOptions);
}

function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  });
}

function getSessionToken(request: Request): string | null {
  const token: unknown = request.cookies?.[SESSION_COOKIE];
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token)
    ? token
    : null;
}

function requireDatabase(response: Response): Pool | null {
  if (!pool) {
    response.status(503).json({
      error: "MySQL is not configured. Set the database values in the local .env file.",
    });
    return null;
  }
  return pool;
}

function publicUser(user: Pick<UserRow, "id" | "name" | "email">): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication attempts. Try again later." },
  }),
);

app.get("/api/health", async (_request, response, next) => {
  if (!pool) {
    response.status(503).json({
      status: "unconfigured",
      databaseConfigured: false,
    });
    return;
  }

  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", databaseConfigured: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", async (request, response, next) => {
  const db = requireDatabase(response);
  if (!db) return;

  const body = bodyRecord(request.body);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || name.length > 120) {
    response.status(400).json({ error: "Name must be between 1 and 120 characters." });
    return;
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    response.status(400).json({
      error: "Password must be at least 8 characters and no more than 72 bytes.",
    });
    return;
  }

  let connection;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [insertResult] = await connection.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash],
    );

    const token = randomBytes(32).toString("hex");
    await connection.execute(
      "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))",
      [insertResult.insertId, hashToken(token)],
    );
    await connection.commit();

    setSessionCookie(response, token);
    response.status(201).json({
      user: { id: insertResult.insertId, name, email },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    if (errorCode(error) === "ER_DUP_ENTRY") {
      response.status(409).json({ error: "An account with this email already exists." });
      return;
    }
    next(error);
  } finally {
    connection?.release();
  }
});

app.post("/api/auth/login", async (request, response, next) => {
  const db = requireDatabase(response);
  if (!db) return;

  const body = bodyRecord(request.body);
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password || email.length > 254) {
    response.status(400).json({ error: "Enter your email address and password." });
    return;
  }

  try {
    const [users] = await db.execute<UserRow[]>(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      response.status(401).json({ error: "Email or password is incorrect." });
      return;
    }

    const token = randomBytes(32).toString("hex");
    await db.execute(
      "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))",
      [user.id, hashToken(token)],
    );
    setSessionCookie(response, token);
    response.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (request, response, next) => {
  const db = requireDatabase(response);
  if (!db) return;

  const token = getSessionToken(request);
  if (!token) {
    response.json({ user: null });
    return;
  }

  try {
    const [users] = await db.execute<UserRow[]>(
      `SELECT u.id, u.name, u.email
       FROM user_sessions s
       INNER JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP()
       LIMIT 1`,
      [hashToken(token)],
    );
    if (!users[0]) {
      clearSessionCookie(response);
      response.json({ user: null });
      return;
    }
    response.json({ user: publicUser(users[0]) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", async (request, response, next) => {
  const token = getSessionToken(request);
  try {
    if (pool && token) {
      await pool.execute("DELETE FROM user_sessions WHERE token_hash = ?", [
        hashToken(token),
      ]);
    }
    clearSessionCookie(response);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error("[api] Request failed", error);
  if (response.headersSent) return;
  const status = clientErrorStatus(error);
  if (status) {
    response.status(status).json({
      error: status === 400 ? "Request body must be valid JSON." : "Invalid request.",
    });
    return;
  }
  response.status(500).json({ error: "The server could not complete the request." });
};
app.use(errorHandler);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "127.0.0.1", () => {
  console.info(`[api] Listening on http://127.0.0.1:${port}`);
  if (!pool) {
    console.warn("[api] MySQL is not configured. Copy .env.example to .env and set its database values.");
  }
});
