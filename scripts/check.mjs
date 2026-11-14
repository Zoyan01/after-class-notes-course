import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = {};
vm.runInNewContext(await readFile(path.join(root, 'content/notes.js'), 'utf8'), sandbox);
const notes = sandbox.STUDY_NOTES;
assert.ok(Array.isArray(notes) && notes.length > 0, '需要至少一篇筆記');
const ids = new Set();
const fields = ['id', 'title', 'category', 'date', 'summary', 'takeaway', 'idea', 'recap'];
for (const note of notes) {
  for (const field of fields) assert.ok(typeof note[field] === 'string' && note[field].trim(), `${note.id || '未命名'} 缺少 ${field}`);
  assert.match(note.id, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, '文章 id 格式錯誤');
  assert.ok(!ids.has(note.id), `id 重複：${note.id}`); ids.add(note.id);
  assert.ok(['提示詞', '觀念整理', '動手做'].includes(note.category), `未定義的分類：${note.category}`);
  assert.match(note.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(`${note.date}T00:00:00Z`).toISOString().slice(0, 10), note.date, '日期不合法');
  assert.ok(Number.isInteger(note.minutes) && note.minutes >= 1 && note.minutes <= 10, '閱讀分鐘數應介於 1–10');
  for (const [field, count] of [['points', 3], ['pitfalls', 2]]) {
    assert.ok(Array.isArray(note[field]) && note[field].length === count, `${field} 需要 ${count} 項`);
    assert.ok(note[field].every(value => typeof value === 'string' && value.trim()), `${field} 不可留空`);
  }
  for (const field of ['before', 'after', 'caption']) assert.ok(typeof note.example?.[field] === 'string' && note.example[field].trim(), `範例缺少 ${field}`);
  assert.ok(Array.isArray(note.sources));
  for (const source of note.sources) { assert.ok(source.label?.trim()); assert.equal(new URL(source.url).protocol, 'https:', '來源僅可使用 https'); }
}
const htmlFiles = (await readdir(root)).filter(file => file.endsWith('.html'));
let localLinks = 0;
for (const file of htmlFiles) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /<html lang="zh-Hant"/);
  assert.match(html, /name="viewport"/);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(url)) continue;
    assert.ok(!url.startsWith('/'), `不可使用根目錄絕對路徑：${file} ${url}`);
    const resource = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!resource) continue;
    await access(path.resolve(root, resource)); localLinks++;
  }
}
console.log(`檢查通過：${notes.length} 篇筆記、${htmlFiles.length} 個 HTML 頁面、${localLinks} 個本機資源連結。`);
