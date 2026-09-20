#!/usr/bin/env node
// 项目体检（原 F:\ARG_test\check_*.py 的 Node 版，收编进仓库）
// 用法：npm run check
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

const missing = [...refs].filter((r) => !fs.existsSync(path.join(PUB, r.slice(1))))

console.log('== 引用但缺失（会 404）==')
console.log(missing.length ? missing.map((m) => '  MISSING ' + m).join('\n') : '  无')

const imgDir = path.join(PUB, 'img')
const imgs = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []
let total = 0
for (const f of imgs) total += fs.statSync(path.join(imgDir, f)).size
console.log(`\n== 图片 ==\n  ${imgs.length} 个，共 ${(total / 1024 / 1024).toFixed(1)} MB`)

const fontDir = path.join(SRC, 'assets', 'fonts')
const fonts = fs.existsSync(fontDir) ? fs.readdirSync(fontDir) : []
let fTotal = 0
for (const f of fonts) fTotal += fs.statSync(path.join(fontDir, f)).size
console.log(`\n== 自托管字体 ==\n  ${fonts.length} 个，共 ${(fTotal / 1024).toFixed(0)} KB`)
for (const f of fonts) console.log(`    ${f}  ${(fs.statSync(path.join(fontDir, f)).size / 1024).toFixed(0)} KB`)

const audioDir = path.join(PUB, 'audio')
console.log('\n== 音频 ==')
if (fs.existsSync(audioDir))
  for (const f of fs.readdirSync(audioDir)) console.log(`  ${f}  ${(fs.statSync(path.join(audioDir, f)).size / 1024).toFixed(0)} KB`)
else console.log('  （无）')

if (missing.length) process.exitCode = 1
