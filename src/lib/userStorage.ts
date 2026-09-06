// ─── User Storage (server-only) ───────────────────────────────
// Stores admin users in .admin-users.json at project root (outside public/)
import fs from 'fs';
import path from 'path';
import * as OTPAuth from 'otpauth';
import { timingSafeEqual, scryptSync, randomBytes } from 'crypto';

// ─── Password hashing (scrypt) ─────────────────────────────────
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `$scrypt$${salt}$${hash}`;
}

function verifyPasswordHash(stored: string, input: string): boolean {
  if (stored.startsWith('$scrypt$')) {
    const parts = stored.split('$'); // ['', 'scrypt', salt, hash]
    const salt  = parts[2];
    const hash  = parts[3];
    const inputHash   = scryptSync(input, salt, 64);
    const storedHash  = Buffer.from(hash, 'hex');
    if (inputHash.length !== storedHash.length) return false;
    return timingSafeEqual(inputHash, storedHash);
  }
  // Legacy plaintext — migrate on next read
  return safeEqual(input, stored);
}

export type UserRole = 'superadmin' | 'editor';

export interface AdminUser {
  id: string;
  username: string;
  password: string;       // plain text — hashed comparison is done timing-safe
  role: UserRole;
  totpSecret?: string;    // base32 — undefined means not yet configured
  totpConfigured: boolean;
  createdAt: string;
  createdBy: string;
  active: boolean;
}

const USERS_FILE = path.join(process.cwd(), '.admin-users.json');

function readUsers(): AdminUser[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    // Guard: file may have been written as an object instead of array
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function writeUsers(users: AdminUser[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// ─── Bootstrap superadmin from env on first run ────────────────
export function ensureSuperadmin() {
  const users = readUsers();
  if (users.some((u) => u.role === 'superadmin')) return;

  // Migrate old single-user setup
  const username = process.env.ADMIN_USERNAME ?? 'akamco';
  const password = process.env.ADMIN_PASSWORD ?? 'akamco2026';

  // Import existing TOTP secret if present
  const oldTotpFile = path.join(process.cwd(), '.admin-totp-secret');
  const totpSecret  = fs.existsSync(oldTotpFile)
    ? fs.readFileSync(oldTotpFile, 'utf-8').trim()
    : undefined;

  const superadmin: AdminUser = {
    id:             'superadmin',
    username,
    password,
    role:           'superadmin',
    totpSecret,
    totpConfigured: !!totpSecret,
    createdAt:      new Date().toISOString(),
    createdBy:      'system',
    active:         true,
  };
  writeUsers([superadmin]);
}

// ─── CRUD ──────────────────────────────────────────────────────
export function getAllUsers(): AdminUser[] {
  ensureSuperadmin();
  return readUsers();
}

export function getUserByUsername(username: string): AdminUser | undefined {
  ensureSuperadmin();
  return readUsers().find((u) => u.username === username && u.active);
}

export function getUserById(id: string): AdminUser | undefined {
  return readUsers().find((u) => u.id === id);
}

export function createUser(data: {
  username: string;
  password: string;
  role: UserRole;
  createdBy: string;
}): AdminUser {
  const users = readUsers();
  if (users.some((u) => u.username === data.username)) {
    throw new Error('Username already exists.');
  }
  const user: AdminUser = {
    id:             Date.now().toString(),
    username:       data.username.trim().toLowerCase(),
    password:       hashPassword(data.password),
    role:           data.role,
    totpConfigured: false,
    createdAt:      new Date().toISOString(),
    createdBy:      data.createdBy,
    active:         true,
  };
  writeUsers([...users, user]);
  return user;
}

export function updateUser(id: string, data: Partial<Pick<AdminUser, 'password' | 'role' | 'active' | 'totpSecret' | 'totpConfigured'>>) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found.');
  users[idx] = { ...users[idx], ...data };
  writeUsers(users);
  return users[idx];
}

export function deleteUser(id: string) {
  const users = readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error('User not found.');
  if (user.role === 'superadmin') throw new Error('Cannot delete superadmin.');
  writeUsers(users.filter((u) => u.id !== id));
}

// ─── Credential check (timing-safe) ───────────────────────────
function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) {
      timingSafeEqual(Buffer.alloc(1), Buffer.alloc(1));
      return false;
    }
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function verifyUserCredentials(username: string, password: string): AdminUser | null {
  const user = getUserByUsername(username);
  if (!user) {
    // Dummy compare to avoid timing oracle
    safeEqual('x', 'y');
    return null;
  }
  if (!verifyPasswordHash(user.password, password)) return null;
  // Auto-migrate plaintext password to scrypt hash
  if (!user.password.startsWith('$scrypt$')) {
    updateUser(user.id, { password: hashPassword(password) });
  }
  return user;
}

// ─── Per-user TOTP ─────────────────────────────────────────────
export function getUserTOTPSecret(user: AdminUser): string {
  if (user.totpSecret) return user.totpSecret;
  // Generate + persist for this user
  const secret = new OTPAuth.Secret({ size: 20 });
  updateUser(user.id, { totpSecret: secret.base32 });
  return secret.base32;
}

export function verifyUserTOTP(user: AdminUser, code: string): boolean {
  const secret = getUserTOTPSecret(user);
  const totp = new OTPAuth.TOTP({
    issuer: 'Akamco Admin',
    label:  user.username,
    secret: OTPAuth.Secret.fromBase32(secret),
    digits: 6,
    period: 30,
    algorithm: 'SHA1',
  });
  return totp.validate({ token: code.replace(/\s/g, ''), window: 1 }) !== null;
}

export function getTOTPUri(user: AdminUser): string {
  const secret = getUserTOTPSecret(user);
  const totp = new OTPAuth.TOTP({
    issuer: 'Akamco Admin',
    label:  user.username,
    secret: OTPAuth.Secret.fromBase32(secret),
    digits: 6,
    period: 30,
    algorithm: 'SHA1',
  });
  return totp.toString();
}
