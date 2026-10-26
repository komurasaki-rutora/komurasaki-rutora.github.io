
import json
import re
from pathlib import Path

# このスクリプトがある場所をホームページのフォルダにする
ROOT = Path(__file__).resolve().parent
IMAGE_ROOT = ROOT / "images"

CATEGORIES = {
    "fanart": "ファンアート",
    "copyright": "版権イラスト",
    "original": "自身のイラスト＆創作",
    "gift": "みんなが描いてくれた自分のファンアート",
}

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def number_key(path):
    # ファイル名に含まれる数字を取得。数字がなければ -1
    numbers = re.findall(r"\d+", path.stem)
    return int(numbers[-1]) if numbers else -1


gallery = {}

for category, title in CATEGORIES.items():
    folder = IMAGE_ROOT / category
    files = []

    if folder.exists():
        images = [
            p for p in folder.iterdir()
            if p.is_file() and p.suffix.lower() in EXTENSIONS
        ]

        # 数字の大きい順。数字が同じならファイル名順
        images.sort(
            key=lambda p: (number_key(p), p.name.lower()),
            reverse=True
        )

        for image in images:
            files.append({
                "src": image.relative_to(ROOT).as_posix(),
                "alt": image.stem,
            })

    gallery[category] = {
        "title": title,
        "images": files,
    }

output = ROOT / "images.json"
output.write_text(
    json.dumps(gallery, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(f"ギャラリー情報を作成しました: {output}")
for category, data in gallery.items():
    print(f"{data['title']}: {len(data['images'])} 枚")
