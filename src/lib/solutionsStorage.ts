// ─── Solutions Storage (server-only) ──────────────────────────
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { solutions as staticSolutions } from '@/data/solutions';
import type { SolutionDetail } from '@/data/solutions';

const DATA_FILE = path.join(process.cwd(), 'solutions-data.json');

function readData(): SolutionDetail[] {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(staticSolutions, null, 2), 'utf-8');
    return staticSolutions;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as SolutionDetail[];
}

function writeData(data: SolutionDetail[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getAllSolutions(): SolutionDetail[] {
  return readData();
}

export function getSolutionById(id: string): SolutionDetail | null {
  return readData().find((s) => s.id === id) ?? null;
}

export function addSolution(input: SolutionDetail): SolutionDetail {
  const data = readData();
  if (data.find((s) => s.id === input.id)) {
    throw new Error(`Solution with id "${input.id}" already exists.`);
  }
  data.push(input);
  writeData(data);
  return input;
}

export function updateSolution(
  id: string,
  updates: Partial<SolutionDetail>
): SolutionDetail | null {
  const data = readData();
  const idx = data.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  writeData(data);
  return data[idx];
}

export function deleteSolution(id: string): boolean {
  const data = readData();
  const idx = data.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  data.splice(idx, 1);
  writeData(data);
  return true;
}
