import { describe, it, expect } from 'vitest'
import { obf, deobf, deobfList } from '../src/utils/obfuscate'

describe('轻度混淆工具', () => {
  it('obf → deobf 往返一致', () => {
    const samples = ['丙|甲|戊|丁|乙', 'crack', '门|柜|梁|井|窗', 'obituary|yaozha|fortuneslip|guestbook', '中文abc123', '']
    for (const s of samples) expect(deobf(obf(s))).toBe(s)
  })

  it('谜题内嵌常量可正确还原（防手滑改坏）', () => {
    expect(deobfList('==Qm5SOfBiL58pIimznsUeOfZiL5')).toEqual(['丙', '甲', '戊', '丁', '乙']) // 录音正解磁带位
    expect(deobf('=s2YhJ3Y')).toBe('crack') // 旧影正解
    expect(deobfList('==wlqeOfVqL58FoomzHnfaOfoeZ6')).toEqual(['门', '柜', '梁', '井', '窗']) // 五路逃生口
    expect(deobfList('==wav9mY0NXZ1dGfwlGbzVmb1RncvZGfhhmevFWe8lnchVHdpJ2b')).toEqual(['obituary', 'yaozha', 'fortuneslip', 'guestbook']) // 灰线四样回执
  })

  it('损坏输入返回空串而非抛错', () => {
    expect(deobf('not-base64!!')).toBe('')
  })
})
