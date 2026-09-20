// 轻度混淆：抬高「直接读打包产物搜答案」的门槛，**不是安全手段**。
// 做法：UTF-8 → base64 → 整体反转。运行时 deobf 还原。
// 仅供谜题「答案」这类高剧透字面量使用；数据推导型（如宅院方位表）保持可读。

function toUtf8(s) {
  return decodeURIComponent(escape(atob(s)))
}

export function obf(plain) {
  // 仅用于离线生成编码常量（不参与运行时判定）
  return btoa(unescape(encodeURIComponent(plain)))
    .split('')
    .reverse()
    .join('')
}

export function deobf(encoded) {
  try {
    return toUtf8(encoded.split('').reverse().join(''))
  } catch (e) {
    return ''
  }
}

// 还原成数组
export function deobfList(encoded, sep = '|') {
  const s = deobf(encoded)
  return s ? s.split(sep) : []
}
