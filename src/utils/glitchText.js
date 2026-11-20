// 残页提示的「动态乱码」：同一句话在可读与崩坏之间逐帧跳。
// 与 utils/glitch.js 的区别：那边是一次性生成一段乱码占位；这边是保留原文骨架、按帧替换。
export const NOISE = '锟斤拷烫屯¤§〓※▓▒░■□'

// 标点与空白永不被替换，句子才不会散架
const KEEP = '。，、；：！？…—·「」『』（）　 \n'

/**
 * 生成一帧。
 * @param {string} text 原句
 * @param {{quiet?: boolean, rate?: number, rng?: () => number}} opts
 *        quiet=true 时整句可读（给玩家一个读完的窗口）
 *        rate 为单字被替换的概率
 * @returns {{c: string, noisy: boolean}[]}
 */
export function glitchFrame(text, { quiet = false, rate = 0.3, rng = Math.random } = {}) {
  return Array.from(text).map((c) => {
    if (quiet || KEEP.includes(c)) return { c, noisy: false }
    if (rng() < rate) {
      return { c: NOISE[Math.floor(rng() * NOISE.length)] || '�', noisy: true }
    }
    return { c, noisy: false }
  })
}
