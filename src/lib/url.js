// 因為網站放在 /portfolio 底下，站內連結都要加上 base
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p = '/') => base + (p.startsWith('/') ? p : '/' + p);
