import { describe, it, expect } from 'vitest'
import FRAGMENTS from '../src/data/fragments'
import JOURNAL from '../src/data/journal'
import ENTITIES from '../src/data/entities'
import { LEVELS, resolveRef } from '../src/data/net'

const FRAG_IDS = new Set(FRAGMENTS.map((f) => f.id))
const ART_IDS = new Set(JOURNAL.map((a) => a.id))
const ALL = new Set([...FRAG_IDS, ...ART_IDS])
const ENT_IDS = new Set(ENTITIES.map((e) => e.id))

describe('碎片网 · 引用完整性（原 check_refs.py）', () => {
  it('碎片 / 馆刊 id 不重复', () => {
    expect(FRAG_IDS.size).toBe(FRAGMENTS.length)
    expect(ART_IDS.size).toBe(JOURNAL.length)
  })

  it('所有 refs 都能解析，无悬空', () => {
    const refs = [...FRAGMENTS, ...JOURNAL].flatMap((x) => x.refs || [])
    expect(refs.length).toBeGreaterThan(100)
    const dangling = [...new Set(refs.filter((r) => !ALL.has(r)))]
    expect(dangling).toEqual([])
  })

  it('所有 entities 都能解析', () => {
    const used = FRAGMENTS.flatMap((f) => f.entities || [])
    const dangling = [...new Set(used.filter((e) => !ENT_IDS.has(e)))]
    expect(dangling).toEqual([])
  })

  it('每个碎片都有线索分级（LEVELS 覆盖全部碎片）', () => {
    const missing = FRAGMENTS.filter((f) => !(f.id in LEVELS)).map((f) => f.id)
    expect(missing).toEqual([])
  })

  it('LEVELS 不残留已删除的 id', () => {
    const stale = Object.keys(LEVELS).filter((id) => !ALL.has(id))
    expect(stale).toEqual([])
  })

  it('requires 的钥匙都有产出（key 字段）', () => {
    const produced = new Set(FRAGMENTS.map((f) => f.key).filter(Boolean))
    const needed = [...new Set(FRAGMENTS.map((f) => f.requires).filter(Boolean))]
    const orphan = needed.filter((k) => !produced.has(k))
    expect(orphan).toEqual([])
  })

  it('resolveRef 对已知/未知 id 行为正确', () => {
    expect(resolveRef(FRAGMENTS[0].id)).toBeTruthy()
    expect(resolveRef('__nope__')).toBeNull()
  })
})
