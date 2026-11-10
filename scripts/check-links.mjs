// 全站連結檢查：掃 dist/ 裡每一頁的站內連結與圖片（href／src 開頭是 /portfolio），找出指到不存在檔案的
// 用法：npm run check（會先 build 再檢查）；有壞連結就印出來並以錯誤結束，推上線前要先過
// 11/10 加：英文版密碼頁「← All work」連到 /portfolioen/（少斜線）上線好幾天才發現
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'dist';
const BASE = '/portfolio';

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const exists = (url) => {
  const rel = decodeURI(url.slice(BASE.length)) || '/';
  const path = join(ROOT, rel);
  if (rel.endsWith('/')) return existsSync(join(path, 'index.html'));
  return existsSync(path) || existsSync(join(path, 'index.html'));
};

const pages = walk(ROOT).filter((f) => f.endsWith('.html'));
const broken = [];
let count = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/portfolio[^"#?]*)/g)) {
    count++;
    if (!exists(url)) broken.push(`${page.slice(ROOT.length)}  →  ${url}`);
  }
}

console.log(`檢查 ${pages.length} 頁、${count} 個站內連結與圖片`);
if (broken.length) {
  console.error(`\n壞掉 ${broken.length} 個：`);
  for (const b of [...new Set(broken)]) console.error('  ' + b);
  process.exit(1);
}
console.log('全部正常 ✓');
