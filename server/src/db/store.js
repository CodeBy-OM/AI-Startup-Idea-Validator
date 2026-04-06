import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../data/ideas.json');

// Ensure data directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(join(__dirname, '../../data'), { recursive: true });
} catch {}

function readDB() {
  try {
    if (existsSync(DB_PATH)) {
      const raw = readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getAll() {
    return readDB();
  },
  getById(id) {
    return readDB().find(item => item.id === id) || null;
  },
  insert(item) {
    const ideas = readDB();
    ideas.unshift(item);
    writeDB(ideas);
    return item;
  },
  delete(id) {
    const ideas = readDB();
    const idx = ideas.findIndex(i => i.id === id);
    if (idx === -1) return false;
    ideas.splice(idx, 1);
    writeDB(ideas);
    return true;
  },
};
