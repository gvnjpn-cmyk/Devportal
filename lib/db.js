// lib/db.js — JSON file storage (Vercel: pakai /tmp, reset per cold start)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : join(process.cwd(), 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const USAGE_FILE = join(DATA_DIR, 'usage.json');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file, fallback = []) {
  try {
    ensureDir();
    if (!existsSync(file)) return fallback;
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch { return fallback; }
}

function writeJSON(file, data) {
  ensureDir();
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Users ──────────────────────────────────────────
export function getUsers() { return readJSON(USERS_FILE, []); }
export function saveUsers(users) { writeJSON(USERS_FILE, users); }

export function findUserByEmail(email) {
  return getUsers().find(u => u.email === email.toLowerCase());
}

export function findUserById(id) {
  return getUsers().find(u => u.id === id);
}

export function findUserByApiKey(apiKey) {
  return getUsers().find(u => u.apiKeys?.some(k => k.key === apiKey));
}

export function createUser({ id, name, email, passwordHash, createdAt }) {
  const users = getUsers();
  const user = { id, name, email, passwordHash, createdAt, apiKeys: [] };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

// ── Usage ──────────────────────────────────────────
export function getUsage() { return readJSON(USAGE_FILE, {}); }
export function saveUsage(usage) { writeJSON(USAGE_FILE, usage); }

export function recordUsage(userId, endpoint) {
  const usage = getUsage();
  if (!usage[userId]) usage[userId] = { total: 0, endpoints: {}, daily: {}, recent: [] };
  const u = usage[userId];
  u.total++;
  u.endpoints[endpoint] = (u.endpoints[endpoint] || 0) + 1;
  const today = new Date().toISOString().split('T')[0];
  u.daily[today] = (u.daily[today] || 0) + 1;
  u.recent.unshift({ endpoint, time: new Date().toISOString() });
  if (u.recent.length > 50) u.recent = u.recent.slice(0, 50);
  saveUsage(usage);
}

export function getUserUsage(userId) {
  const usage = getUsage();
  return usage[userId] || { total: 0, endpoints: {}, daily: {}, recent: [] };
}
