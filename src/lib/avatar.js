// Jessy 頭像：日系手繪大頭（C 版：米色大衣＋黑圍巾）
// 輸出一個 SVG 字串，內含 5 個表情，用 svg[data-expr] 切換顯示。
// 表情：0 普通、1 開心、2 眨眼、3 驚訝、4 害羞、5 生氣（彩蛋用）、6 難過、7 大笑

export const EXPRESSIONS = ['普通', '開心', '眨眼', '驚訝', '害羞', '生氣', '難過', '大笑'];

const P = {
  ink: '#2a211c', hair: '#5e4130', skin: '#fffaf2',
  cream: '#f3e6cf', coat: '#cdb79e', scarf: '#2f2a28',
  rust: '#c8653f', mustard: '#d9a441', blush: '#e08a6a',
};

const V = { stroke: 2.5, offset: [-3, 2], blush: 0.75 };

const S = {
  hairBack: 'M100 36 C56 36 40 66 40 100 L41 130 Q48 140 62 135 L138 135 Q152 140 159 130 L160 100 C160 66 144 36 100 36 Z',
  body: 'M54 200 C54 162 76 142 100 142 C124 142 146 162 146 200 Z',
  earL: 'M58 94 C49 94 49 112 58 112',
  earR: 'M142 94 C151 94 151 112 142 112',
  face: { cx: 100, cy: 100, rx: 44, ry: 40 },
  hairL: 'M99 66 C92 72 82 80 72 90 C63 100 58 116 60 132 Q50 140 41 130 L40 100 C40 62 64 38 99 38 Z',
  hairR: 'M99 66 C106 72 118 80 128 86 C135 90 140 92 144 95 L160 100 C160 62 134 38 99 38 Z',
  coatV: 'M100 160 L90 200 L110 200 Z',
  lapelL: 'M82 150 L94 182',
  lapelR: 'M118 150 L106 182',
  scarf: 'M68 144 Q100 160 132 144 L134 155 Q100 172 66 155 Z',
  scarfEnd: 'M74 156 L69 198 L85 198 L88 162 Z',
};

function star(cx, cy, R = 7, r = 3) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' ';
  }
  return d + 'Z';
}
const sparkle = (x, y, k = 1) =>
  `M${x} ${y - 8 * k} Q${x + 1} ${y - 1} ${x + 8 * k} ${y} Q${x + 1} ${y + 1} ${x} ${y + 8 * k} Q${x - 1} ${y + 1} ${x - 8 * k} ${y} Q${x - 1} ${y - 1} ${x} ${y - 8 * k} Z`;

function faceParts(e) {
  const y = 104, L = 82, R = 118, ink = P.ink, lw = 2.6, my = y + 12;
  const ln = (d, w = lw, c = ink) =>
    `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const dot = (x, r = 3.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}"/>`;
  const happyEye = (x) => `M${x - 5} ${y + 2} Q${x} ${y - 5} ${x + 5} ${y + 2}`;
  const shyEye = (x) => `M${x - 5} ${y - 1} Q${x} ${y + 4} ${x + 5} ${y - 1}`;
  const bo = e === 4 ? 0.9 : V.blush;
  let s = `<circle cx="70" cy="${y + 10}" r="6.5" fill="${P.blush}" opacity="${bo}"/><circle cx="130" cy="${y + 10}" r="6.5" fill="${P.blush}" opacity="${bo}"/>`;
  s += ln(`M67 ${y + 12} l2 -4 M71 ${y + 12} l2 -4 M127 ${y + 12} l2 -4 M131 ${y + 12} l2 -4`, 1.4, P.rust);
  if (e === 0) s += dot(L) + dot(R) + ln(`M95 ${my} Q100 ${my + 4} 105 ${my}`);
  if (e === 1)
    s += ln(happyEye(L) + ' ' + happyEye(R)) +
      `<path d="M90 ${my - 2} L110 ${my - 2} Q110 ${my + 10} 100 ${my + 10} Q90 ${my + 10} 90 ${my - 2} Z" fill="${P.rust}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>` +
      ln('M34 56 l-6 -4 M30 70 l-7 0 M166 56 l6 -4 M170 70 l7 0', 2.2);
  if (e === 2)
    s += dot(R) + ln(`M${L - 5} ${y - 3} L${L + 4} ${y} L${L - 5} ${y + 3}`) + ln(`M94 ${my} Q100 ${my + 5} 106 ${my}`) +
      `<path d="${star(168, 50)}" fill="${P.mustard}" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
      ln('M156 60 q4 -2 6 -5', 1.8);
  if (e === 3)
    s += dot(L, 3.6) + dot(R, 3.6) +
      `<ellipse cx="100" cy="${my + 2}" rx="3.4" ry="4.2" fill="${P.rust}" stroke="${ink}" stroke-width="2"/>` +
      `<path d="${sparkle(30, 52)}" fill="${ink}"/><path d="${sparkle(172, 70, 0.6)}" fill="${ink}"/>`;
  if (e === 4)
    s += ln(shyEye(L) + ' ' + shyEye(R)) + ln(`M96 ${my} Q100 ${my + 3} 104 ${my}`) +
      `<text x="164" y="54" font-size="18" fill="${ink}" font-family="serif">♪</text>`;
  if (e === 5)
    s += ln(`M${L - 6} ${y - 9} L${L + 5} ${y - 5} M${R + 6} ${y - 9} L${R - 5} ${y - 5}`, 2.4) +
      dot(L, 3) + dot(R, 3) + ln(`M94 ${my + 3} Q100 ${my - 2} 106 ${my + 3}`) +
      ln('M160 46 l6 6 M166 46 l-6 6 M156 52 q5 -4 10 0', 2.2, P.rust);
  if (e === 6)
    s += ln(`M${L - 6} ${y - 6} L${L + 5} ${y - 10} M${R + 6} ${y - 6} L${R - 5} ${y - 10}`, 2.4) +
      dot(L, 3) + dot(R, 3) + ln(`M93 ${my + 4} Q96 ${my} 100 ${my + 1} Q104 ${my} 107 ${my + 4}`) +
      `<path d="M${L + 2} ${y + 6} Q${L + 6} ${y + 13} ${L + 2} ${y + 15} Q${L - 2} ${y + 13} ${L + 2} ${y + 6} Z" fill="#9cc3d5" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M156 58 q-2 -9 7 -9 q2 -7 10 -4 q7 -2 8 5 q6 2 3 8 Z" fill="#fff" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>` +
      ln('M162 63 l-2 5 M170 63 l-2 5 M178 63 l-2 5', 1.8, '#6f9fb5');
  if (e === 7)
    s += ln(`M${L - 5} ${y - 4} L${L + 4} ${y} L${L - 5} ${y + 4} M${R + 5} ${y - 4} L${R - 4} ${y} L${R + 5} ${y + 4}`) +
      `<path d="M88 ${my - 3} L112 ${my - 3} Q112 ${my + 13} 100 ${my + 13} Q88 ${my + 13} 88 ${my - 3} Z" fill="${P.rust}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>` +
      `<path d="M93 ${my + 9} Q100 ${my + 4} 107 ${my + 9} Q104 ${my + 12.5} 100 ${my + 12.5} Q96 ${my + 12.5} 93 ${my + 9} Z" fill="#f2a58a"/>` +
      `<path d="${sparkle(30, 56)}" fill="${P.mustard}" stroke="${ink}" stroke-width="1.4"/>` +
      `<path d="${sparkle(170, 50, 0.7)}" fill="${P.mustard}" stroke="${ink}" stroke-width="1.4"/>` +
      ln('M24 76 l-6 2 M176 72 l6 2', 2.2);
  return s;
}

/**
 * @param {{ uid: string, expr?: number, title?: string }} opts
 */
export function avatarSVG({ uid, expr = 0, title = 'Jessy 的插畫頭像' }) {
  const [ox, oy] = V.offset, f = S.face, lw = V.stroke;
  const faceEl = (extra = '') => `<ellipse cx="${f.cx}" cy="${f.cy}" rx="${f.rx}" ry="${f.ry}" ${extra}/>`;
  const filters = [1, 2, 3].map((n) =>
    `<filter id="rough-${uid}-${n}" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="${n * 7}"/>` +
    `<feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>`).join('');
  const exprs = EXPRESSIONS.map((_, i) => `<g class="expr" data-e="${i}">${faceParts(i)}</g>`).join('');
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}" data-expr="${expr}" data-uid="${uid}">
  <defs>${filters}
    <filter id="grain-${uid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="3" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" result="dots"/>
      <feComposite in="dots" in2="SourceGraphic" operator="in" result="g"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge>
    </filter>
    <mask id="lm-${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
      <g class="lines" stroke="#fff" stroke-width="${lw}" stroke-linecap="round" stroke-linejoin="round" fill="#000" filter="url(#rough-${uid}-1)">
        <rect x="0" y="0" width="200" height="200" stroke="none"/>
        <path d="${S.hairBack}"/>
        <path d="${S.body}"/><path d="${S.coatV}"/>
        <path d="${S.lapelL}" fill="none"/><path d="${S.lapelR}" fill="none"/>
        <path d="${S.scarf}"/><path d="${S.scarfEnd}"/>
        <path d="${S.earL}" fill="none"/><path d="${S.earR}" fill="none"/>
        ${faceEl()}
        <path d="${S.hairL}"/><path d="${S.hairR}"/>
        <path d="M99 38 L99 66" fill="none" stroke-width="${lw * 0.7}"/>
      </g>
    </mask>
  </defs>
  <g class="body-fill" transform="translate(${ox} ${oy})" filter="url(#grain-${uid})">
    <path d="${S.hairBack}" fill="${P.hair}"/>
    <path d="${S.body}" fill="${P.coat}"/><path d="${S.coatV}" fill="${P.cream}"/>
    <path d="${S.scarf}" fill="${P.scarf}"/><path d="${S.scarfEnd}" fill="${P.scarf}"/>
    <path d="${S.earL} Z" fill="${P.skin}"/><path d="${S.earR} Z" fill="${P.skin}"/>
    ${faceEl(`fill="${P.skin}"`)}
    <path d="${S.hairL}" fill="${P.hair}"/><path d="${S.hairR}" fill="${P.hair}"/>
  </g>
  <rect x="0" y="0" width="200" height="200" fill="${P.ink}" mask="url(#lm-${uid})"/>
  <circle cx="147" cy="116" r="2.4" fill="${P.mustard}" stroke="${P.ink}" stroke-width="1.4"/>
  <g class="face">${exprs}</g>
</svg>`;
}
