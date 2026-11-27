// 灰线（焚账）的四样回执：讣告 / 药渣 / 财签 / 留言墙。
// 清单轻度混淆，避免直接读打包产物就知道要搜什么；判定与人读的进度共用同一份。
import { deobfList } from '../utils/obfuscate'

export const GREY_PROOF = deobfList('==wav9mY0NXZ1dGfwlGbzVmb1RncvZGfhhmevFWe8lnchVHdpJ2b')

export function greyHave(hasRead) {
  return GREY_PROOF.filter((id) => hasRead(id)).length
}
