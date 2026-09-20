# -*- coding: utf-8 -*-
"""把 public/img 下的 png/jpg 全量转 WebP（原图移到备份目录），减小站点体积。

依赖： pip install pillow
用法：
  python scripts/to-webp.py [图片目录] [原图备份目录]
默认： 图片目录 public/img ，备份目录 _src_backup（仓库外，勿入库）
"""
import os
import shutil
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "public", "img")
BAK = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "_src_backup")
os.makedirs(BAK, exist_ok=True)

from PIL import Image  # noqa: E402

before = after = 0
converted = []
for fn in sorted(os.listdir(SRC)):
    if not fn.lower().endswith((".png", ".jpg", ".jpeg")):
        continue
    p = os.path.join(SRC, fn)
    out = os.path.join(SRC, os.path.splitext(fn)[0] + ".webp")
    if os.path.exists(out):
        shutil.move(p, os.path.join(BAK, fn))
        continue
    try:
        im = Image.open(p)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (12, 9, 6))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.save(out, "WEBP", quality=82, method=6)
        b, a = os.path.getsize(p), os.path.getsize(out)
        before += b
        after += a
        converted.append((fn, os.path.basename(out), b // 1024, a // 1024))
        shutil.move(p, os.path.join(BAK, fn))
    except Exception as e:  # noqa: BLE001
        print("FAIL", fn, e)

print("转换:", len(converted))
for c in converted[:8]:
    print("  %-24s -> %-24s %5dKB -> %4dKB" % c)
print("原图总计 %.1f MB -> WebP %.1f MB" % (before / 1048576, after / 1048576))
print("原图备份:", BAK)
