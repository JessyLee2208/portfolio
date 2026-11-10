// @ts-check
import { defineConfig } from 'astro/config';

// 部署在 GitHub Pages：https://jessylee2208.github.io/portfolio
export default defineConfig({
  site: 'https://jessylee2208.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  i18n: {
    // 中文先上線，英文版之後補在 /en/ 底下
    locales: ['zh-tw', 'en'],
    defaultLocale: 'zh-tw',
    routing: { prefixDefaultLocale: false },
  },
});
