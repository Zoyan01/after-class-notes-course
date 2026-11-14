import { cp, mkdir, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.resolve(root, 'dist');
if (destination !== path.join(root, 'dist') || path.dirname(destination) !== root) throw new Error('建置目錄超出專案');
const existing = await lstat(destination).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
if (existing?.isSymbolicLink()) throw new Error('dist 不可為符號連結');
await rm(destination, { recursive: true, force: true });
await mkdir(destination);
for (const file of ['index.html', 'note.html', 'about.html', 'rules.html', '404.html', '.nojekyll', 'AGENTS.md', 'assets', 'content', 'templates']) {
  await cp(path.join(root, file), path.join(destination, file), { recursive: true });
}
console.log(`網站已建置到 ${destination}`);
