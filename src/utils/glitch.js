// B 面乱码：中文经典乱码（锟斤拷 / 烫烫烫 / 屯屯屯）+ 替换符 + 符号
const CHARS = '锟斤拷烫烫烫屯屯屯�〓※¤§¿¡□■'

export function glitch(n = 6) {
  let s = ''
  for (let i = 0; i < n; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}

// 把一段文字随机打坏（ratio 为被替换的比例）
export function corrupt(text = '', ratio = 0.12) {
  return text.split('').map(ch => (Math.random() < ratio ? glitch(1) : ch)).join('')
}
