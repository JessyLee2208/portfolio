// 中英雙語：英文頁放在 /en/ 底下。元件用 langOf(Astro.url) 自己判斷語言，不用一層層傳 prop
import { url } from './url.js';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// 已經有英文版的頁面（路徑不含 base、不含 /en）；還沒翻的頁面不顯示語言切換，也不連過去
export const EN_PAGES = ['/', '/cases/branch/'];

/** 目前頁面的語言：'en' 或 'zh' */
export const langOf = (u) => (u.pathname.startsWith(base + '/en/') || u.pathname === base + '/en' ? 'en' : 'zh');

/** 去掉 base 和 /en 的路徑，例如 /cases/branch/ */
export const pagePath = (u) => {
  let p = u.pathname.slice(base.length) || '/';
  if (p === '/en' || p.startsWith('/en/')) p = p.slice(3) || '/';
  return p.endsWith('/') ? p : p + '/';
};

/** 站內連結：英文頁且該頁有英文版 → 連到 /en/...；否則連中文版 */
export const lurl = (lang, p = '/') => {
  const [path, hash = ''] = p.split('#');
  const norm = path.endsWith('/') ? path : path + '/';
  const target = lang === 'en' && EN_PAGES.includes(norm) ? '/en' + (norm === '/' ? '/' : norm) : path;
  return url(target) + (hash ? '#' + hash : '');
};

/** 另一個語言的同一頁；沒有英文版時回傳 null */
export const altUrl = (u) => {
  const p = pagePath(u);
  if (!EN_PAGES.includes(p)) return null;
  return langOf(u) === 'en' ? url(p) : url('/en' + (p === '/' ? '/' : p));
};

/** 取字：t(lang, { zh: '…', en: '…' }) */
export const t = (lang, s) => (typeof s === 'string' ? s : s[lang] ?? s.zh);
