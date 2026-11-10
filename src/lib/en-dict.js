// 圖解裡的短句中英對照（AI 交付流程案例）。元件寫 x('中文')，英文頁就查這張表
import { langOf } from './i18n.js';

export const EN = {
  // HeroFlow
  '交付流程：Jessy 寫 spec，交稿前先跑 AI Review，再交給工程師；AI 找得全，我再逐條判斷': 'Handoff flow: Jessy writes the spec, runs an AI review before handoff, then hands it to engineers. AI casts a wide net; I judge every item',
  '寫 spec': 'Write the spec',
  'Figma · 標註': 'Figma · annotations',
  '沒有可用優惠時，整塊隱藏': 'Hide the whole block when no discount applies',
  '狀態值 0＝不適用': 'Status 0 = not applicable',
  '（AI 查證：程式碼）': ' (AI-checked: code)',
  '票 × spec 對得上嗎？': 'Do ticket and spec match?',
  '有沒寫完整、衝突的？': 'Anything incomplete or conflicting?',
  '少見的情況定義了嗎？': 'Edge cases defined?',
  '會影響其他品牌嗎？': 'Impact on other brands?',
  '交給工程師': 'Hand off to engineers',
  '✓ 已標註': '✓ Labeled',
  '標出 AI 查證的段落': 'AI-checked parts marked',
  '✓ 一致': '✓ Consistent',
  '票上與 spec 同一件事': 'Ticket and spec say the same thing',
  'AI 找得全，': 'AI casts a wide net; ',
  '我再逐條判斷': 'I judge every item',
  // Research
  '工程師都說：AI 查的要標出來': 'Engineers agreed: label what AI checked',
  '研究發現：後端與前端工程師都希望 AI 查證的內容被標出來': 'Research findings: both backend and frontend engineers want AI-checked content labeled',
  '後端工程師': 'Backend engineers',
  '先看哪裡': 'Reads first',
  '先看票上的驗收條件': 'Acceptance criteria on the ticket',
  '會當場比對票和 Figma 一不一致': 'Checks ticket against Figma on the spot',
  'AI 查證': 'AI-checked',
  '希望標出來，每個人的解讀會不同': 'Label it: everyone reads it differently',
  '後端': 'Backend',
  'Web／App 前端工程師': 'Web / app engineers',
  '先看票確認邏輯，再看 Figma 細節': 'Ticket for logic, then Figma for details',
  '可以寫，但要註明是 AI 查證的': 'Fine to include, if marked as AI-checked',
  '開發時會把 spec 直接丟給 AI 讀': 'Feeds the spec straight to AI while building',
  '前端': 'Frontend',
  'spec 也要': 'Specs must ',
  '讓 AI 讀得懂': 'make sense to AI, too',
  // Review
  '把 refinement 會問的，先問完': 'Ask refinement’s questions before refinement',
  '決策 1：交稿前先讓 AI 跑四項固定檢查，我逐條判斷後，改版後再複查': 'Decision 1: before handoff, AI runs four fixed checks, I judge each finding, and a follow-up check runs after revisions',
  '每份 spec 都跑同一套': 'Same checks for every spec',
  '票 × spec 逐條對照': 'Ticket × spec, line by line',
  '✅ 對得上　⚠️ 對不上　❌ 稿上沒有': '✅ matches　⚠️ conflicts　❌ missing in design',
  '沒寫完整、有衝突': 'Incomplete or conflicting',
  '兩處寫法不同、分支只寫一半': 'Two versions of one rule, half-written branches',
  '少見的情況': 'Edge cases',
  '載入／沒資料／失敗／極端值': 'Loading / empty / error / extreme values',
  '跨品牌、跨頁面': 'Across brands and pages',
  '改一個元件會不會影響別處': 'Does changing one component affect others?',
  'AI 列出來 → ': 'AI lists → ',
  '我逐條判斷': 'I judge each one',
  '：真問題／要問人／AI 誤判': ': real issue / ask someone / AI mistake',
  '改版後複查': 'Re-check after revisions',
  '已修好': 'Fixed',
  '還沒動': 'Not yet',
  '新帶進來': 'Newly introduced',
  // Values
  '技術數值回產品查證，不靠記憶寫': 'Check technical values in the product, not from memory',
  '決策 2：spec 上寫的 Eatigo 斷點 600px，產品實際是 768px': 'Decision 2: the spec said Eatigo’s breakpoint was 600px; in the product it was 768px',
  'spec 上寫的': 'In the spec',
  '產品實際的': 'In the product',
  '漏寫的會被問，': 'Missing info gets asked about; ',
  '寫錯的值只會被照做': 'wrong values get built',
  // Annotate
  'AI 查證過的內容，一律標出來': 'Always label what AI checked',
  '決策 3：spec 標註中，AI 查證過的技術結論標上來源，設計決定不標': 'Decision 3: in spec annotations, technical conclusions checked by AI are labeled with their source; design decisions are not',
  'Figma 標註板': 'Figma annotations',
  '沒有可用優惠時，整個區塊隱藏': 'Hide the whole section when no discount applies',
  '設計決定 · 不標': 'Design decision · no label',
  '狀態值「0」在結帳頁代表不適用': 'Status “0” means “not applicable” at checkout',
  'AI 查證：程式碼': 'AI-checked: code',
  '是「請複查」': 'It means “please check,”',
  '不是「可以相信」': 'not “safe to trust”',
};

/** 在元件裡：const x = tr(Astro.url); x('中文') */
export const tr = (u) => {
  const en = langOf(u) === 'en';
  return (s) => (en ? EN[s] ?? s : s);
};
