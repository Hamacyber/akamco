// ─── Partner Storage (server-only) ────────────────────────────
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { partners as staticPartners, partnerCategories as staticCategories } from '@/data/partners';
import type { StoredPartner } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'partners-data.json');

interface PartnerData {
  partners: StoredPartner[];
  categories: string[];
}

function readData(): PartnerData {
  if (!existsSync(DATA_FILE)) {
    // Seed from static partners.ts on first run
    const categories = staticCategories.map((c) => c.name);
    const partners: StoredPartner[] = staticPartners.map((p, i) => ({
      id: randomUUID(),
      name: p.name,
      description: p.description,
      category: p.category,
      logo: p.logo,
      logoDark: undefined,
      url: undefined,
      order: i,
    }));
    const data: PartnerData = { partners, categories };
    writeData(data);
    return data;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as PartnerData;
}

function writeData(data: PartnerData): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Partners ──────────────────────────────────────────────────

export function getAllPartners(): StoredPartner[] {
  return readData().partners.sort((a, b) => a.order - b.order);
}

export function getPartnerById(id: string): StoredPartner | null {
  return readData().partners.find((p) => p.id === id) ?? null;
}

export function addPartner(
  input: Omit<StoredPartner, 'id' | 'order'>
): StoredPartner {
  const data = readData();
  const maxOrder = data.partners.reduce((m, p) => Math.max(m, p.order), -1);
  const partner: StoredPartner = { ...input, id: randomUUID(), order: maxOrder + 1 };
  data.partners.push(partner);
  writeData(data);
  return partner;
}

export function updatePartner(
  id: string,
  updates: Partial<Omit<StoredPartner, 'id' | 'order'>>
): StoredPartner | null {
  const data = readData();
  const idx = data.partners.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.partners[idx] = { ...data.partners[idx], ...updates };
  writeData(data);
  return data.partners[idx];
}

export function deletePartner(id: string): boolean {
  const data = readData();
  const idx = data.partners.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  data.partners.splice(idx, 1);
  // Re-index orders so they stay contiguous
  data.partners.sort((a, b) => a.order - b.order).forEach((p, i) => { p.order = i; });
  writeData(data);
  return true;
}

export function reorderPartner(
  id: string,
  action: 'move-up' | 'move-down' | 'move-top'
): boolean {
  const data = readData();
  const sorted = data.partners.sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  if (action === 'move-top') {
    sorted.unshift(sorted.splice(idx, 1)[0]);
  } else if (action === 'move-up' && idx > 0) {
    [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]];
  } else if (action === 'move-down' && idx < sorted.length - 1) {
    [sorted[idx + 1], sorted[idx]] = [sorted[idx], sorted[idx + 1]];
  } else {
    return false; // already at boundary
  }

  sorted.forEach((p, i) => { p.order = i; });
  data.partners = sorted;
  writeData(data);
  return true;
}

// ─── Categories ────────────────────────────────────────────────

export function getCategories(): string[] {
  return readData().categories;
}

export function addCategory(name: string): boolean {
  const data = readData();
  if (data.categories.includes(name)) return false;
  data.categories.push(name);
  writeData(data);
  return true;
}

export function renameCategory(oldName: string, newName: string): boolean {
  const data = readData();
  const idx = data.categories.indexOf(oldName);
  if (idx === -1) return false;
  if (data.categories.includes(newName)) return false;
  data.categories[idx] = newName;
  // Update all partners in this category
  data.partners.forEach((p) => { if (p.category === oldName) p.category = newName; });
  writeData(data);
  return true;
}

export function deleteCategory(name: string): { ok: boolean; reason?: string } {
  const data = readData();
  if (!data.categories.includes(name)) return { ok: false, reason: 'Not found' };
  const hasPartners = data.partners.some((p) => p.category === name);
  if (hasPartners) return { ok: false, reason: 'Category still has partners. Move or delete them first.' };
  data.categories = data.categories.filter((c) => c !== name);
  writeData(data);
  return { ok: true };
}
