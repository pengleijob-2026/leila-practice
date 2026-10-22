#!/usr/bin/env python3
"""Generate one Seedance clip on Volcengine Ark and report its real cost.

    ARK_API_KEY=... python3 moling/tools/ark_video.py \
        --model 2.0 --image first.jpg --prompt-file s01.txt --duration 5 --out s01.mp4

Only successful tasks are billed. Cost = usage.completion_tokens x price per
million tokens (image-to-video counts as "no video input").
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks"

MODELS = {
    "2.5": "doubao-seedance-2-5-260628",
    "2.0": "doubao-seedance-2-0-260128",
    "2.0-fast": "doubao-seedance-2-0-fast-260128",
    "2.0-mini": "doubao-seedance-2-0-mini-260615",
}

# CNY per million tokens, no video input. Source: docs.volcengine.com/docs/82379/1544106
PRICE = {
    ("2.5", "480p"): 70, ("2.5", "720p"): 70, ("2.5", "1080p"): 77,
    ("2.0", "480p"): 46, ("2.0", "720p"): 46,
    ("2.0-fast", "480p"): 37, ("2.0-fast", "720p"): 37,
}


def call(method, url, key, body=None):
    req = urllib.request.Request(
        url,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode(errors='replace')}")


def data_url(path):
    mime = mimetypes.guess_type(path)[0] or "image/jpeg"
    with open(path, "rb") as f:
        return f"data:{mime.lower()};base64,{base64.b64encode(f.read()).decode()}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", choices=MODELS, default="2.0")
    ap.add_argument("--image", help="first-frame image")
    ap.add_argument("--prompt")
    ap.add_argument("--prompt-file")
    ap.add_argument("--duration", type=int, default=5)
    ap.add_argument("--resolution", default="720p")
    ap.add_argument("--audio", action="store_true", help="let the model generate sound")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    key = os.environ.get("ARK_API_KEY")
    if not key:
        sys.exit("ARK_API_KEY is not set")
    prompt = a.prompt or open(a.prompt_file, encoding="utf-8").read().strip()

    content = [{"type": "text", "text": prompt}]
    if a.image:
        content.append({"type": "image_url", "image_url": {"url": data_url(a.image)}, "role": "first_frame"})
    body = {
        "model": MODELS[a.model],
        "content": content,
        "resolution": a.resolution,
        # Seedance 2.5 only accepts "adaptive" when a first frame is given.
        "ratio": "adaptive" if a.image else "16:9",
        "duration": a.duration,
        "generate_audio": a.audio,
        "watermark": False,
    }

    task = call("POST", API, key, body)["id"]
    print(f"task {task} ({MODELS[a.model]})", flush=True)
    t0 = time.time()
    while True:
        time.sleep(15)
        r = call("GET", f"{API}/{task}", key)
        if r["status"] == "succeeded":
            break
        if r["status"] in ("failed", "cancelled", "expired"):
            sys.exit(f"{r['status']}: {json.dumps(r.get('error'), ensure_ascii=False)}")
        print(f"  {r['status']} {int(time.time() - t0)}s", flush=True)

    urllib.request.urlretrieve(r["content"]["video_url"], a.out)
    tokens = r["usage"]["completion_tokens"]
    price = PRICE.get((a.model, a.resolution))
    cost = f"¥{tokens * price / 1e6:.2f}" if price else "unknown (price not in table)"
    secs = r.get("duration") or a.duration
    print(json.dumps({
        "out": a.out, "model": r["model"], "seconds": secs, "resolution": r.get("resolution"),
        "fps": r.get("framespersecond"), "tokens": tokens, "cost": cost,
        "per_second": f"¥{tokens * price / 1e6 / secs:.2f}" if price else None,
        "elapsed_s": int(time.time() - t0),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
