#!/usr/bin/env node
/**
 * genimg —— GrsAI（gpt-image-2）出图工具
 *
 * 用法（在任意目录）：
 *   node F:\tools\genimg.mjs "上半羊皮纸、下半火焰的网页背景，无文字" -o strike_bg -a 16:9
 *   node F:\tools\genimg.mjs "五路财神年画，做旧" -n 3 -d F:\out
 *   node F:\tools\genimg.mjs --manifest F:\ARG_test\img_manifest.json
 *
 * 选项：
 *   -p, --prompt <text>     提示词（也可直接写第一个位置参数）
 *       --prompt-file <f>   从文件读提示词（长提示用）
 *   -o, --out <name>        输出文件名（不含扩展名；默认 img-<时间戳>）
 *   -a, --ar <w:h>          画幅比例，默认 3:2
 *   -n, --n <count>         出几张，默认 1（多张为 -1/-2… 后缀）
 *   -d, --dir <path>        输出目录，默认 F:\tools\genimg-out
 *   -m, --model <name>      模型，默认 gpt-image-2
 *   -r, --ref <url>         参考图 URL，可重复
 *       --manifest <file>   批量清单（JSON 数组：[{file,prompt,aspectRatio}]）
 *       --key <key>         API Key（默认读 $env:GRS_KEY → F:\tools\.grs_key → F:\ARG_test\.grs_key）
 *       --overwrite         同名直接覆盖（默认自动加序号，不覆盖已有文件）
 *       --dry-run           只打印将保存的路径，不真的出图
 *   -h, --help              显示帮助
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.GRS_BASE || 'https://grsai.dakka.com.cn'
const KEY_FILES = [process.env.GRS_KEY_FILE, 'F:\\tools\\.grs_key', 'F:\\ARG_test\\.grs_key'].filter(Boolean)
const DEFAULT_DIR = process.env.GENIMG_DIR || 'F:\\tools\\genimg-out'
const DEFAULT_MODEL = 'gpt-image-2'

const HELP = `genimg —— GrsAI 出图

  node genimg.mjs "提示词" [-o 名字] [-a 16:9] [-n 2] [-d 目录]
  node genimg.mjs --manifest 清单.json
  node genimg.mjs --help

选项：
  -p, --prompt <文字>      提示词（也可直接作为第一个位置参数）
      --prompt-file <文件> 从文件读取提示词
  -o, --out <名字>         输出文件名（不含扩展名），默认 img-<时间戳>
  -a, --ar <w:h>           画幅比例，默认 3:2
  -n, --n <张数>           出几张，默认 1
  -d, --dir <目录>         输出目录，默认 ${DEFAULT_DIR}
  -m, --model <模型>       默认 ${DEFAULT_MODEL}
  -r, --ref <url>          参考图 URL，可重复
      --manifest <文件>    批量清单 JSON
      --key <key>          API Key（默认读 .grs_key 或 $env:GRS_KEY）
      --overwrite          同名覆盖（默认自动加序号）
      --dry-run            只打印路径，不出图
  -h, --help               显示本帮助
`

const FLAG = {
  '-p': 'prompt', '--prompt': 'prompt',
  '--prompt-file': 'promptFile',
  '-o': 'out', '--out': 'out',
  '-a': 'ar', '--ar': 'ar',
  '-n': 'n', '--n': 'n',
  '-d': 'dir', '--dir': 'dir',
  '-m': 'model', '--model': 'model',
  '--manifest': 'manifest',
  '--key': 'key',
}
const BOOL = { '--overwrite': 'overwrite', '--dry-run': 'dryRun', '-h': 'help', '--help': 'help' }

function parse(argv) {
  const o = { ar: '3:2', n: 1, model: DEFAULT_MODEL, refs: [], pos: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-r' || a === '--ref') { o.refs.push(argv[++i]); continue }
    if (BOOL[a]) { o[BOOL[a]] = true; continue }
    if (FLAG[a]) { o[FLAG[a]] = argv[++i]; continue }
    o.pos.push(a)
  }
  return o
}

function readKey(o) {
  if (o.key) return o.key
  if (process.env.GRS_KEY) return process.env.GRS_KEY
  for (const f of KEY_FILES) {
    try { const k = fs.readFileSync(f, 'utf8').trim(); if (k) return k } catch (e) { /* next */ }
  }
  return ''
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function create(key, body) {
  const r = await fetch(BASE + '/v1/draw/completions', {
    method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify(body),
  })
  const j = await r.json()
  if (j.code !== 0) throw new Error('提交失败：' + (j.msg || JSON.stringify(j)))
  return j.data.id
}

async function poll(key, id) {
  for (;;) {
    const r = await fetch(BASE + '/v1/draw/result', {
      method: 'POST', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ id }),
    })
    const j = await r.json()
    if (j.code === -22) throw new Error('超时（可稍后重试）')
    if (j.code !== 0) throw new Error('查询失败：' + (j.msg || JSON.stringify(j)))
    const d = j.data
    if (d.status === 'running') { process.stdout.write('.'); await sleep(5000); continue }
    if (d.status === 'succeeded') {
      const urls = (d.results || []).map(x => x && x.url).filter(Boolean)
      if (!urls.length && d.url) urls.push(d.url)
      if (!urls.length) throw new Error('成功但没拿到图片地址')
      return urls
    }
    throw new Error('生成失败：' + (d.failure_reason || d.error || d.status))
  }
}

async function download(url, file) {
  const r = await fetch(url)
  if (!r.ok) throw new Error('下载失败 ' + r.status)
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()))
}

function pickName(dir, out, overwrite) {
  if (overwrite) return out
  if (!fs.existsSync(out)) return out
  const ext = path.extname(out)
  const stem = out.slice(0, -ext.length)
  for (let i = 2; i < 1000; i++) {
    const c = path.join(dir, `${stem}-${i}${ext}`)
    if (!fs.existsSync(c)) return c
  }
  throw new Error('同名文件太多，换个名字吧')
}

async function runOne(key, o, prompt, baseName, dir) {
  process.stdout.write(`gen  ${baseName}  `)
  const id = await create(key, {
    model: o.model, prompt, variants: Math.max(1, parseInt(o.n, 10) || 1),
    urls: o.refs, webHook: '-1', aspectRatio: o.ar,
  })
  const urls = await poll(key, id)
  const saved = []
  for (let i = 0; i < urls.length; i++) {
    const nm = urls.length > 1 ? `${baseName}-${i + 1}.png` : `${baseName}.png`
    const target = pickName(dir, path.join(dir, nm), o.overwrite)
    await download(urls[i], target)
    saved.push(target)
  }
  console.log('  ok -> ' + saved.map(p => path.basename(p)).join(', '))
  return saved
}

async function main() {
  const o = parse(process.argv.slice(2))
  if (o.help || (!o.prompt && !o.promptFile && !o.manifest && !o.pos.length)) {
    process.stdout.write(HELP)
    process.exit(o.help ? 0 : 1)
  }
  const key = readKey(o)
  if (!key) { console.error('缺少 API Key：放到 F:\\tools\\.grs_key，或设 $env:GRS_KEY，或用 --key'); process.exit(1) }
  const dir = path.resolve(o.dir || DEFAULT_DIR)
  fs.mkdirSync(dir, { recursive: true })

  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)

  if (o.manifest) {
    const list = JSON.parse(fs.readFileSync(o.manifest, 'utf8'))
    console.log(`清单 ${list.length} 条 -> ${dir}`)
    let ok = 0
    for (const it of list) {
      const ar = it.aspectRatio || o.ar
      const name = String(it.file || '').replace(/\.(png|jpe?g|webp)$/i, '')
      try {
        if (o.dryRun) { console.log('dry  ' + path.join(dir, name + '.png')); ok++; continue }
        await runOne(key, { ...o, ar }, it.prompt, name, dir)
        ok++
      } catch (e) { console.error('  FAIL ' + name + ' :: ' + e.message) }
    }
    console.log(`完成：成功 ${ok} / ${list.length}`)
    return
  }

  const prompt = o.prompt || (o.promptFile ? fs.readFileSync(o.promptFile, 'utf8').trim() : o.pos.join(' '))
  const baseName = o.out || ('img-' + stamp)
  if (o.dryRun) { console.log('dry  ' + path.join(dir, baseName + '.png')); return }
  await runOne(key, o, prompt, baseName, dir)
}

main().catch(e => { console.error('出错：' + e.message); process.exit(1) })
