// B 面乱码：中文经典乱码（锟斤拷 / 烫烫烫 / 屯屯屯）+ 替换符 + 符号
const CHARS = '锟斤拷烫烫烫屯屯屯�〓※¤§¿¡□■'

export function glitch(n = 6) {
  let s = ''
  for (let i = 0; i < n; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}
