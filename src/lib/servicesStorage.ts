// ─── Services Storage (server-only) ───────────────────────────
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { services as staticServices } from '@/data/services';
import type { ServiceDetail } from '@/data/services';

const DATA_FILE = path.join(process.cwd(), 'services-data.json');

function readData(): ServiceDetail[] {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(staticServices, null, 2), 'utf-8');
    return staticServices;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as ServiceDetail[];
}

function writeData(data: ServiceDetail[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getAllServices(): ServiceDetail[] {
  return readData();
}

export function getServiceById(id: string): ServiceDetail | null {
  return readData().find((s) => s.id === id) ?? null;
}

export function addService(input: ServiceDetail): ServiceDetail {
  const data = readData();
  if (data.find((s) => s.id === input.id)) {
    throw new Error(`Service with id "${input.id}" already exists.`);
  }
  data.push(input);
  writeData(data);
  return input;
}

export function updateService(
  id: string,
  updates: Partial<ServiceDetail>
): ServiceDetail | null {
  const data = readData();
  const idx = data.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  writeData(data);
  return data[idx];
}

export function deleteService(id: string): boolean {
  const data = readData();
  const idx = data.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  data.splice(idx, 1);
  writeData(data);
  return true;
}
