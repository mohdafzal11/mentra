import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const SESSION_COOKIE = "mim_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-secret-change-me"
);

// ─── Token helpers ───────────────────────────────

async function createSessionToken(sessionId: string): Promise<string> {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuedAt()
    .sign(secret);
}

async function verifySessionToken(
  token: string
): Promise<{ sessionId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sessionId: string };
  } catch {
    return null;
  }
}

// ─── Public API ──────────────────────────────────

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      name,
    },
  });

  return user;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  const session = await prisma.session.create({
    data: {
      id: uuid(),
      userId,
      expiresAt,
    },
  });

  const token = await createSessionToken(session.id);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return session.user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const payload = await verifySessionToken(token);
    if (payload) {
      await prisma.session
        .delete({ where: { id: payload.sessionId } })
        .catch(() => {});
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionFromCookieValue(token: string) {
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session;
}
