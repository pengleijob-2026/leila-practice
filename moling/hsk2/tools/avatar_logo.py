"""Frame a square character portrait as the round 蕾姐 logo: ink ring + red seal.

usage: python avatar_logo.py portrait.png MaShanZheng.ttf out.png
"""
import sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, font_path, out_path = sys.argv[1:4]
rng = np.random.default_rng(7)
C, R = 1024, 478
ink = np.array([0.10, 0.11, 0.12])

im = Image.open(src).convert('RGB')
w, h = im.size
s = min(w, h)
# keep the face in the upper-middle of the disc
im = im.crop(((w - s) // 2, int((h - s) * 0.3), (w - s) // 2 + s, int((h - s) * 0.3) + s))
P = np.array(im.resize((C, C), Image.LANCZOS)).astype(np.float32) / 255

yy, xx = np.mgrid[0:C, 0:C]
d = np.sqrt((xx - C / 2) ** 2 + (yy - C / 2) ** 2)
edgeN = cv2.GaussianBlur(rng.normal(0, 1, (C, C)).astype(np.float32), (0, 0), 3) * 5
disc = np.clip((R + edgeN - d) / 2, 0, 1)

ang = np.arctan2(yy - C / 2, xx - C / 2)
th = np.clip(6 + 6 * np.sin(ang + 0.6) + 3 * np.sin(ang * 3.3) + 2 * np.sin(ang * 7.1), 1.5, None)
streak = cv2.GaussianBlur(rng.normal(0, 1, (C, C)).astype(np.float32), (0, 0), 0.8)
ring = np.clip((th - np.abs(d - (R - 6))) / 1.5, 0, 1) * np.clip(0.85 + 0.35 * streak, 0, 1)
gap = (ang > 2.15) & (ang < 2.55)
ring[gap] *= np.clip(np.abs(ang[gap] - 2.35) / 0.2, 0, 1)
P = P * (1 - ring[..., None] * 0.92) + ink * ring[..., None] * 0.92

out = np.dstack([np.clip(P, 0, 1), np.maximum(disc, ring * (d < R + 25))])
img = Image.fromarray((out * 255).astype(np.uint8), 'RGBA')

S = 150
seal = Image.new('RGBA', (S, S), (0, 0, 0, 0))
sd = ImageDraw.Draw(seal)
sd.rounded_rectangle([6, 6, S - 6, S - 6], radius=14, fill=(184, 67, 47, 255))
f = ImageFont.truetype(font_path, 118)
bb = sd.textbbox((0, 0), '蕾', font=f)
sd.text(((S - bb[2] + bb[0]) / 2 - bb[0], (S - bb[3] + bb[1]) / 2 - bb[1]), '蕾', font=f, fill=(246, 242, 233, 255))
sa = np.array(seal).astype(np.float32)
sa[..., 3] *= np.where(rng.random((S, S)) < 0.06, 0.25, 1.0)
seal = Image.fromarray(sa.astype(np.uint8)).rotate(-5, resample=Image.BICUBIC, expand=True)
img.alpha_composite(seal, (int(C * 0.73), int(C * 0.72)))
img.save(out_path)
