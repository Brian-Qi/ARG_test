import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src')
const PUB = path.join(root, 'public')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const refs = new Set()
for (const f of walk(SRC).filter((f) => /\.(vue|js|css)$/.test(f))) {
  const t = fs.readFileSync(f, 'utf8')
  for (const m of t.matchAll(/\/img\/[A-Za-z0-9_.-]+/g)) refs.add(m[0])
  for (const m of t.matchAll(/\/audio\/[A-Za-z0-9_.-]+/g)) refs.add(m[0])
}

describe('静态资源引用（原 check_project.py 的缺失检查）', () => {
  it('src 中引用的 /img 与 /audio 文件都存在', () => {
    const missing = [...refs].filter((r) => !fs.existsSync(path.join(PUB, r.slice(1))))
    expect(missing).toEqual([])
  })

  it('引用数量在合理区间（防正则失效导致空跑）', () => {
    expect(refs.size).toBeGreaterThan(50)
  })
})
