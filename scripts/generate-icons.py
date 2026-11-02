import os
from PIL import Image, ImageDraw

base_dir = 'C:/Users/ADMIN/.gemini/antigravity/scratch/nginda-warriors-fc'
crest_path = os.path.join(base_dir, 'apps/public-website/public/brand/nginda-warriors-crest.png')
im = Image.open(crest_path)
bbox = im.getbbox()
im_cropped = im.crop(bbox)

def make_icon(size, scale=0.88, round_mask=False):
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 255))
    h = int(size * scale)
    w = int(h * im_cropped.width / im_cropped.height)
    resized = im_cropped.resize((w, h), Image.Resampling.LANCZOS)
    x = (size - w) // 2
    y = (size - h) // 2
    canvas.paste(resized, (x, y), resized)
    
    if round_mask:
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        round_canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_canvas.paste(canvas, (0, 0), mask)
        return round_canvas
    return canvas

def make_foreground(size, scale=0.74):
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    h = int(size * scale)
    w = int(h * im_cropped.width / im_cropped.height)
    resized = im_cropped.resize((w, h), Image.Resampling.LANCZOS)
    x = (size - w) // 2
    y = (size - h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas

# 1. Update public web icons in both apps
for app in ['apps/public-website', 'apps/control-centre']:
    pub = os.path.join(base_dir, app, 'public')
    make_icon(512, scale=0.88).save(os.path.join(pub, 'icon-512.png'))
    make_icon(192, scale=0.88).save(os.path.join(pub, 'icon-192.png'))
    make_icon(180, scale=0.88).save(os.path.join(pub, 'apple-touch-icon.png'))
    make_icon(64, scale=0.88).save(os.path.join(pub, 'favicon.png'))
    print(f'Saved web icons for {app}')

# 2. Android mipmap resources
android_res = os.path.join(base_dir, 'apps/public-website/android/app/src/main/res')
densities = {
    'mipmap-mdpi': (48, 108),
    'mipmap-hdpi': (72, 162),
    'mipmap-xhdpi': (96, 216),
    'mipmap-xxhdpi': (144, 324),
    'mipmap-xxxhdpi': (192, 432),
}

for folder, (icon_sz, fg_sz) in densities.items():
    dir_path = os.path.join(android_res, folder)
    os.makedirs(dir_path, exist_ok=True)
    make_icon(icon_sz, scale=0.88).save(os.path.join(dir_path, 'ic_launcher.png'))
    make_icon(icon_sz, scale=0.88, round_mask=True).save(os.path.join(dir_path, 'ic_launcher_round.png'))
    make_foreground(fg_sz, scale=0.74).save(os.path.join(dir_path, 'ic_launcher_foreground.png'))
    print(f'Generated Android {folder} icons')

# 3. Android adaptive icon xmls (API 26+)
v26_dir = os.path.join(android_res, 'mipmap-anydpi-v26')
os.makedirs(v26_dir, exist_ok=True)

adaptive_xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""

with open(os.path.join(v26_dir, 'ic_launcher.xml'), 'w', encoding='utf-8') as f:
    f.write(adaptive_xml)

with open(os.path.join(v26_dir, 'ic_launcher_round.xml'), 'w', encoding='utf-8') as f:
    f.write(adaptive_xml)

print('Adaptive XMLs written successfully')
