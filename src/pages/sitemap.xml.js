// 網站地圖：列出中英文每一頁，並標出彼此是同一頁的兩種語言（給 Google 用）
import { EN_PAGES } from '../lib/i18n.js';

// Manager 那篇上了密碼（11/10），不放進網站地圖
const PAGES = ['/', '/cases/branch/', '/cases/ai-delivery/', '/cases/myvideo/', '/cases/podcast/', '/cases/bookfast/'];

export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const abs = (p) => new URL(base + p, site).href;
  const entry = (loc, zh, en) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="${zh}"/>${en ? `
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>` : ''}
  </url>`;
  const urls = [];
  for (const p of PAGES) {
    const zh = abs(p);
    const en = EN_PAGES.includes(p) ? abs('/en' + p) : null;
    urls.push(entry(zh, zh, en));
    if (en) urls.push(entry(en, zh, en));
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
