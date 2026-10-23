"""左下角蕾姐数字人层（小课堂和课文共用）。

水墨圆框 MG 常驻最上层；圆框里平时是蕾姐墨灵书房造型的静态照片，蕾姐每说一句，叠上这一句的数字人口播视频（静音，声音仍走 A1 配音）。
口播视频与配音逐句一一对应：LEI_VIDEO 把配音素材 id 映射到用同一条配音生成的数字人视频 id，没有视频的句子只显示静态照片。
"""

PHOTO = "ebba73c4-7df7-4b6e-93b7-53150a273ade"
RING = "4455148246"
# 圆心 (128, 940)；圆框 MG 是 360 框 300 圆的比例，缩到 264 框 220 圆
CX, CY, D = 128, 940, 220
RING_D = D * 360 // 300
LEI_VIDEO = {
    "8a39482faa": "c4e0382ea3",  # K intro
    "2b439eab8a": "102d70709b",  # K outro
    "b021c83c31": "1a61b5d370",  # L end-0
    "0ca9cd16f1": "92c55eb01f",  # L end-1
    "91c365d7a2": "4fb6195d39",  # L end-2
    "8c96b9b9f1": "484ad42e82",  # L g1-0
    "66b0ce0905": "0afdfa1331",  # L g1-1
    "90fd69004d": "3282ed81fe",  # L g1-2
    "3d549db7d5": "18ef156398",  # L g1-3
    "50a214a329": "c110155b7a",  # L g1-4
    "e50b26effa": "d9f6fe7272",  # L g1-5
    "40898e41e8": "d2468ce31a",  # L g1-6
    "0de7b9a90d": "47e566d316",  # L g2-0
    "bb89b3eb43": "e26ef90e1a",  # L g2-1
    "b426e76895": "e0f4e72351",  # L g2-2
    "4711819622": "a9084c3559",  # L g2-3
    "66529e4ad7": "aba3c28df8",  # L g2-4
    "92f9b9566c": "124d99ab43",  # L g2-5
    "6f50e2e860": "cbcba44fd7",  # L g2-6
    "349f84522a": "183060cf54",  # L g3-0
    "b4b927b8a3": "0d05093e70",  # L g3-1
    "62d0658bdc": "e92b71a230",  # L g3-2
    "b9ddef4a72": "bacde1bfdc",  # L g3-3
    "aeb15caed6": "f8d86fa788",  # L g3-4
    "56f3454115": "6970b9c281",  # L g3-5
    "2f5332c1bb": "4e33a99a01",  # L g3-6
    "eee584ccb3": "29a04514b7",  # L hong-0
    "7b3bb0e095": "cf5b0bb35d",  # L hong-1
    "42bb720286": "1fc2eeec87",  # L hong-2
    "6b52a90250": "3004d4af91",  # L hong-3
    "474ebdcb3a": "ad7b4a46f1",  # L hong-4
    "a8d97ccc6b": "e08fed7146",  # L hong-5
    "859424f4aa": "14f576764e",  # L open-0
    "8dc01f9f7c": "2588302220",  # L open-1
    "ada5277b15": "e73f298fec",  # L open-2
    "a31e27134f": "6788172c56",  # L open-3
    "bd985b048b": "4495fd9525",  # L quiz-0
    "9b64a116dd": "abf1197592",  # L quiz-1
    "0c0850774e": "1093d625e8",  # L quiz-4
}


def circle(**kw):
    # 照片和口播视频都是同一构图的正方形，裁成以脸为中心的 84% 正方形，露出领口
    return dict(left=CX - D // 2, top=CY - D // 2, width=D, borderRadius=D // 2,
                cropLeft=0.08, cropRight=0.08, cropTop=0.0, cropBottom=0.16, **kw)


def layer(lines, total, photo_track, video_track, ring_track):
    """lines: [(fromFrame, durationInFrames, audioAssetId)]; returns edit_item adds."""
    out = [dict(type="image", assetId=PHOTO, trackId=photo_track, fromFrame=0, durationInFrames=total, fadeIn=0.5, **circle())]
    for a, n, audio in lines:
        if audio in LEI_VIDEO:
            out.append(dict(type="video", assetId=LEI_VIDEO[audio], trackId=video_track, fromFrame=a, durationInFrames=n,
                            decibelAdjustment=-60, **circle()))
    out.append(dict(type="motion-graphic", assetId=RING, trackId=ring_track, fromFrame=0, durationInFrames=total,
                    left=CX - RING_D // 2, top=CY - RING_D // 2, width=RING_D, height=RING_D, fadeIn=0.5))
    return out
