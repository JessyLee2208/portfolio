"""把 Jessy 手繪頭像（_notion-raw/avatar/*.svg）對齊到同一張畫布，輸出到 public/avatar/{0..5}.svg。

每張畫板尺寸不同，但頭髮和身體是同一份圖：比對相同形狀的路徑算出位移，再統一 viewBox。
用法：python3 scripts/build-avatar.py          → 原色，輸出 public/avatar/
      python3 scripts/build-avatar.py --warm   → 換成網站原本頭像的大地色，輸出 public/avatar-warm/
"""
import sys
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WARM = '--warm' in sys.argv
SRC, OUT = ROOT / '_notion-raw' / 'avatar', ROOT / 'public' / ('avatar-warm' if WARM else 'avatar')

# 原圖頭髮和線條都是 #585858。頭髮是每個檔裡這幾個 <path>（依出現順序，從 0 起算；
# 六個檔圖層順序一樣。當初用平均粗細判斷：頭髮色塊 >13、線條 3–10）。Jessy 改圖層順序的話要重算。
HAIR_IDX = [18, 19, 20, 21, 22, 23, 25, 29, 37, 39, 40, 41]
WARM_MAP = {  # 原色 → 網站原本頭像的顏色（src/lib/avatar.js 的 P）
    '#585858': '#2a211c', '#5a5758': '#2a211c',            # 線條 → ink
    '#9f8f81': '#cdb79e',                                   # 大衣 → coat
    '#fdf4eb': '#fffaf2', '#fef3eb': '#fffaf2',             # 皮膚 → skin
    '#fee0d0': '#f6dcc6',                                   # 瀏海下的陰影
    '#ffd2c9': '#eba58c',                                   # 腮紅 → blush
    '#df6957': '#c8653f', '#ce5358': '#c8653f',             # 嘴巴、腮紅斜線、生氣符號 → rust
    '#fddf19': '#d9a441',                                   # 星星 → mustard
}
HAIR = '#5e4130'
# Jessy 11/10 中午自己重上色的版本：線條黑、頭髮咖啡、大衣米色，其他沿用
NEW_MAP = {'#585858': '#000000', '#5a5758': '#000000', '#9f8f81': '#cbb79e'}
NEW_HAIR = '#5d412f'
# 編號要跟 src/lib/avatar.js 的 EXPRESSIONS 一致
NAMES = ['正常', '喜', '眨眼', '驚訝', '害羞', '怒']
REF = '正常'
VIEWBOX = '27 71 500 564'  # 對齊後六張的聯集範圍（含表情旁的小裝飾）；11/10 中午新版正常.svg 為基準

num = re.compile(r'-?\d+\.?\d*(?:e-?\d+)?')
# 縮小數字時先把色碼整段吃掉原樣放回（不然 #5e4130 會被當成科學記號）
num_or_color = re.compile(r'#[0-9a-fA-F]{6}|-?\d+\.?\d*(?:e-?\d+)?')


def sig(d):
    n = [float(x) for x in num.findall(d)]
    if len(n) < 4:
        return None, None
    return tuple(round(v - (n[0] if i % 2 == 0 else n[1]), 1) for i, v in enumerate(n[:40])), (n[0], n[1])


def paths(s):
    return re.findall(r' d="([^"]+)"', s)


ref = {}
ref_paths = paths((SRC / f'{REF}.svg').read_text())
for d in ref_paths:
    r, p = sig(d)
    if r:
        ref[r] = p


def recolor(svg, cmap=None, hair=None):
    cmap, hair = cmap or WARM_MAP, hair or HAIR
    k = -1

    def one(m):
        nonlocal k
        k += 1
        tag = m.group(0)
        if k in HAIR_IDX:
            assert 'fill="#585858"' in tag, f'第 {k} 個 path 不是頭髮色，圖層順序可能變了'
            return tag.replace('fill="#585858"', f'fill="{hair}"')
        return tag
    svg = re.sub(r'<path[^>]*>', one, svg)
    return re.sub(r'#[0-9a-fA-F]{6}', lambda m: cmap.get(m.group().lower(), m.group()), svg)

OUT.mkdir(parents=True, exist_ok=True)
for i, name in enumerate(NAMES):
    s = (SRC / f'{name}.svg').read_text()
    offs = Counter()
    for d in paths(s):
        r, p = sig(d)
        if r in ref:
            offs[(round(p[0] - ref[r][0], 1), round(p[1] - ref[r][1], 1))] += 1
    (dx, dy), hits = offs.most_common(1)[0]
    if WARM or s.count('fill="#585858"') > 20:  # 還是舊灰色版的檔，自動換成 Jessy 新版的顏色
        s = recolor(s, NEW_MAP, NEW_HAIR) if not WARM else recolor(s)
    inner = s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S)
    inner = num_or_color.sub(lambda m: m.group() if m.group().startswith('#') else f'{float(m.group()):.1f}'.rstrip('0').rstrip('.'), inner)  # 數字留一位小數
    inner = re.sub(r'\s+', ' ', inner).replace('> <', '><')
    out = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX}">'
           f'<g transform="translate({-dx} {-dy})">{inner}</g></svg>')
    (OUT / f'{i}.svg').write_text(out)
    print(f'{i} {name}: 位移 ({dx}, {dy})，{hits} 個形狀對上，{len(out) // 1024} KB')

# ── 小頭像（只有頭）：Jessy 另外畫的「畫板 - 9.svg」，灰色版 → 換成新版顏色，輸出 public/avatar/head.svg
# 頭髮 path：跟彩色版正常.svg 逐一比對形狀（同比例）＋平均粗細判斷出來的
HEAD_SRC = SRC / '畫板 - 9.svg'
HEAD_HAIR_IDX = [9, 10, 11, 12, 13, 14, 15, 16, 20, 21, 25, 26, 27, 28, 29, 30, 31, 56, 57]
if HEAD_SRC.exists() and not WARM:
    s = HEAD_SRC.read_text()
    k = -1

    def head_one(m):
        global k
        k += 1
        tag = m.group(0)
        if k in HEAD_HAIR_IDX:
            return tag.replace('fill="#585858"', f'fill="{NEW_HAIR}"')
        return tag
    s = re.sub(r'<path[^>]*>', head_one, s)
    s = re.sub(r'#[0-9a-fA-F]{6}', lambda m: NEW_MAP.get(m.group().lower(), m.group()), s)
    vb = re.search(r'viewBox="([^"]*)"', s).group(1)
    inner = s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S)
    inner = num_or_color.sub(lambda m: m.group() if m.group().startswith('#') else f'{float(m.group()):.1f}'.rstrip('0').rstrip('.'), inner)
    inner = re.sub(r'\s+', ' ', inner).replace('> <', '><')
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{inner}</svg>'
    (OUT / 'head.svg').write_text(out)
    print(f'head 小頭像：{len(out) // 1024} KB，viewBox {vb}')
