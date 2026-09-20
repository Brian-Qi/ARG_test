# -*- coding: utf-8 -*-
"""字体子集化：把原字体按「项目实际用字」裁成 woff2，用于自托管（替代 Google Fonts 外链）。

为什么要做：Google Fonts 的 CJK 字体会被切成数百个 @font-face 子集（本项目曾达 579 个），
且境内直连 fonts.googleapis.com 会被拖垮/拦截。自托管 + 按用字子集化后，4 个字族约 2MB。

准备原字体（OFL 许可，从 google/fonts 仓库下载到某个目录，例如 F:\\cache\\fonts）：
  ofl/mashanzheng/MaShanZheng-Regular.ttf
  ofl/liujianmaocao/LiuJianMaoCao-Regular.ttf
  ofl/zhimangxing/ZhiMangXing-Regular.ttf
  ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf   （可变字重，另存为 NotoSerifSC.ttf）

依赖： pip install fonttools brotli

用法：
  python scripts/fonts-subset.py [原字体目录] [输出目录]
默认： 原字体目录 F:\\cache\\fonts ，输出 src/assets/fonts
"""
import os
import subprocess
import sys

FONT_DIR = sys.argv[1] if len(sys.argv) > 1 else r"F:\cache\fonts"
OUT_DIR = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "src", "assets", "fonts")
SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "src")
INDEX = os.path.join(os.path.dirname(__file__), "..", "index.html")
os.makedirs(OUT_DIR, exist_ok=True)

# 1) 收集实际用字
chars = set()
for root, _, files in os.walk(SRC_DIR):
    for fn in files:
        if fn.split(".")[-1].lower() in ("js", "vue", "css", "html"):
            try:
                chars |= set(open(os.path.join(root, fn), encoding="utf-8").read())
            except Exception:
                pass
try:
    chars |= set(open(INDEX, encoding="utf-8").read())
except Exception:
    pass
chars |= set(chr(c) for c in range(0x20, 0x7F))  # ASCII
chars |= set("，。、；：？！“”‘’（）《》〈〉【】…—·～￥×÷≈°「」『』〔〕％＋－＝")
chars = {c for c in chars if c.isprintable() or c == " "}
text = "".join(sorted(chars))
print("唯一字符数:", len(chars))

JOBS = [
    ("MaShanZheng-Regular.ttf", "mashanzheng.woff2"),
    ("LiuJianMaoCao-Regular.ttf", "liujianmaocao.woff2"),
    ("ZhiMangXing-Regular.ttf", "zhimangxing.woff2"),
    ("NotoSerifSC.ttf", "notoserifsc.woff2"),
]

for src_name, out_name in JOBS:
    sp = os.path.join(FONT_DIR, src_name)
    op = os.path.join(OUT_DIR, out_name)
    if not os.path.exists(sp):
        print(f"  跳过（缺原字体）: {sp}")
        continue
    cmd = [
        sys.executable, "-m", "fontTools.subset", sp,
        "--text=" + text, "--flavor=woff2", "--output-file=" + op,
        "--layout-features=*", "--no-hinting", "--desubroutinize",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(op):
        print(f"  {out_name:24} OK  {os.path.getsize(op)/1024:8.1f} KB")
    else:
        print(f"  {out_name:24} FAIL rc={r.returncode}")
        if r.stderr:
            print("   ", r.stderr[-600:])
