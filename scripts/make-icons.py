from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

Path('public').mkdir(exist_ok=True)
for size in (16, 32, 48, 128):
    img = Image.new('RGB', (size, size), '#f7efe0')
    draw = ImageDraw.Draw(img)
    pad = int(size * 0.12)
    draw.rounded_rectangle((pad, pad, size - pad, size - pad), radius=max(2, int(size * 0.18)), fill='#172019')
    r = int(size * 0.28)
    cx = cy = size // 2
    draw.ellipse((cx-r, cy-r, cx+r, cy+r), fill='#d7ff4f')
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia Bold.ttf', max(7, int(size * 0.28)))
    except Exception:
        font = ImageFont.load_default()
    text = 'QA'
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text((cx - (bbox[2]-bbox[0])/2, cy - (bbox[3]-bbox[1])/2 - 1), text, fill='#172019', font=font)
    img.save(f'public/icon-{size}.png')
