---
name: xiaolin-explainer-packaging
description: 小Lin说（Xiao Lin Shuo）风格的财经、科普讲解视频包装。包含 Remotion 版式组件库（巨型数字、卡片墙、白卡图表、整页文档荧光笔、真实网页截图荧光笔和聚光、真实 Logo、实体卡、大公式条、白底计算器、折线图、时间轴、饼图和环形图、流程图、树状拆解、世界地图（国家上色和航线）、左右对比、关系图（持股和资金流）、片名和章节卡、画中画、转场），6 套带实物质感底图的主题（财经剪纸印刷、人文报刊纸本、工程蓝图、复古终端、桌面实物、现代杂志，换一个词整片换风格），资料检索规范（每种版式要查的数据和原文、来源分级、事实文件模板、网页截图和原文定位脚本、Wikimedia Commons 照片和 Logo 下载脚本）、按台词关键词计时的分镜 API、分块渲染、人声加音乐加合成音效的混音，以及逐帧质检。适用场景：把出镜口播片段包装成小Lin说式的讲解画面；复刻或改进"一口气了解……"类视频的图形语言；给已有口播视频重做讲解包装。
---

# 小Lin说讲解包装

把一组出镜口播片段（A-roll）和台词，包装成小Lin说式的讲解视频。出镜画面由别的工具生成或拍摄。这个 skill 负责查包装要用的资料，以及讲解画面、字幕、转场和声音。

如果环境里有 `design-aesthetic-standard`，视觉和声音的创作判断同时遵循它。如果有 `video-generation`，出镜片段的生成和剪辑见它。

## 参考文档（按需读取）

- `references/style-bible.md`：她的图形语言、6 条硬规则、色板、字体、画中画、转场统计、声音电平。规划场景前必须读。
- `references/research.md`：每种版式要查什么资料、来源分级、去哪里查、真实网页截图和 Logo 怎么拿、图片和商标权利。规划场景时读。
- `references/layouts.md`：每个版式组件的参数、示例调用和陷阱。写分镜时读。v7 新增的 8 个版式（`line6` `timeline6` `pie6` `flow6` `tree6` `map6` `vs6` `graph6`）的完整示例在 `templates/scenes_gallery.py`，配套演示时间线是 `templates/timeline_gallery.json`。
- `references/storyboard-api.md`：`timeline.json` 和 `project.json` 格式、分镜 API、关键词计时、审片和渲染命令。第一次搭工程时读。

## 环境

- Node ≥ 18、ffmpeg、python3（带 numpy 和 Pillow）。`npm install` 和第一次渲染需要联网（Remotion 会下载 Chrome）。
- 只在 macOS（Apple Silicon）上实测过。其他系统默认用软件渲染 `swangle`，可以用环境变量 `REMOTION_GL` 改。
- 字体：模板带 8 个 SIL OFL 字体，许可证见 `templates/engine/public/fonts/LICENSES.txt`。优设标题黑（`YouShe.ttf`）可能不在包里。`new_project.sh` 会在 `$YOUSHE_TTF` 和常见字体目录里找；找不到时，提示用户从 https://www.uisdc.com/uisdc-first-free-font 下载，存为 `public/fonts/YouShe.ttf`。缺这个字体时，标题和字幕回退到思源黑体最粗字重（900），没有斜切，风格会明显变弱。
- Remotion 许可：个人、3 人以内的公司和非营利组织可以免费使用，包括商用。4 人以上的公司要买公司授权（https://www.remotion.pro/license）。

## 工作流

### 0. 开工前先问用户（一条消息问完，拿到回答再建工程）

- 底图：有没有固定在用的底图（深色底、片名底、片尾底、白纸底）？
  - 有：放进 `public/plates/`，写进 `project.json` 的 `theme`（见 `layouts.md` 的"主题"）。
  - 要新生成：请对方给频道名或品牌色、题材关键词、1–3 张喜欢的参考图，按"主题"一节的要求生成，先给对方看底图再往下做。
  - 都没有：从 6 套主题里选，财经和民生用 `finance`，历史人文用 `press`，AI、软件和互联网用 `blueprint`，网络安全和编程史用 `terminal`，生活消费用 `desk`，其他题材用 `editorial`。拿不准时，用演示工程把候选主题各渲一组关键帧给对方挑（见 `layouts.md` 的"主题"）。
- 台标和角标：`brand.logo` 填什么。出镜画面是不是 AI 生成的？是的话 `brand.label` 必须保留。
- 真实素材：有没有指定要放的报道、报告、网页截图、产品 Logo、实拍或录屏视频？没有指定的，按 `research.md` 自己找。

### 1. 准备输入

- 出镜片段：每句一个 1920×1080 的 mp4，放进 `public/clips/<id>.mp4`。
- 台词：每句有朗读文本 `say`（汉字写法）和字幕文本 `sub`。
- 事实文件：从 `templates/facts_template.md` 复制。已有的事实和来源先写进去，缺的在第 4 步查。
- 可选：实拍或 AI 图（`public/broll/`）、照片（`public/photos/`）、音乐（`public/music/`）、新图标（`public/icons/`）。

### 2. 建工程

```bash
<skill>/scripts/new_project.sh <工程目录>          # 加 --demo 会生成 4 段假出镜和示例分镜，用来冒烟测试
```

然后写 `timeline.json`。转写每段出镜视频，定出 `tin`/`tout`，剪掉首尾静音；中间的口误写进 `cuts`。改 `project.json` 的 `brand`、`music` 和 `theme`（6 套主题和适用题材见 `layouts.md` 的"主题"）。

### 3. 规划场景（先写表，再写代码）

读 `style-bible.md` 和 `research.md` 后，列一张表：场景名 | 覆盖哪几句 | 版式 | 深色还是白纸 | 画中画方式 | 需要的资料。检查以下 5 点：

- 一个场景跨 2–8 句，不要一句一页。
- 每个场景都能指出"主体被裁切"或"主体占画面 60% 以上"（R1）。
- 每 2–3 个深色场景之间有 1 个白纸场景（R2）。
- 引用原文的地方用真实画面：来源是网页就用 `webshot` 截图，PDF 和纸质文件用 `docpage` 逐字原文。讲到具体产品、平台时放真实 Logo（`logo`），不要用文字标签代替。
- 开场钩子、观点句、转折句和结尾留给全屏出镜，不要全部盖上讲解画面。

### 4. 查资料

按场景表的"需要的资料"一列逐条查，方法见 `research.md`。每条结果写进事实文件，带编号、原文、来源链接和日期。照片用 `scripts/commons_photo.py`，网页截图和原文坐标用 `scripts/web_shot.mjs --boxes`，Logo 用 `scripts/commons_logo.py`。

查完回改场景表：找不到逐字原文的，不用 `docpage`；凑不齐同口径数据的，不用 `paper`；拍不到当时版本的页面，不用 `webshot`。台词里的数字和事实文件不一致时，先改台词，再生成或重剪出镜片段。

### 5. 写分镜

从 `templates/scenes_example.py` 复制写法。每个场景都要：

- 元素入场对齐关键词：`S.k('关键词', -0.15)`。
- 当前项亮起，其余压暗（`focus` / `hl` / `lit`）。镜头跟到当前项（`sc.cam` / `look`）。
- 用 `KF.append((标签, 时刻))` 登记至少 1 张审片帧。

运行 `python3 story_core.py timeline.json scenes.py`，确认 `gaps/overlaps []`。

### 6. 关键帧审片（最少 2 轮）

```bash
python3 -c "import json;print(' '.join(str(f) for _,f in json.load(open('keyframes.json'))))" | xargs node render.mjs stills stills/k1
python3 <skill>/scripts/sheet.py stills/k1 keyframes.json 6
```

逐张查看拼图，按下面的审片清单修改，然后重渲染改过的帧。有她的原片时，截取同类版式的原帧并排对比。

### 7. 整片、混音、合成、质检

```bash
<skill>/scripts/render_chunks.sh video.mp4
python3 <skill>/scripts/mix_audio.py timeline.json mix_raw.wav
<skill>/scripts/finalize.sh video.mp4 mix_raw.wav final.mp4
python3 <skill>/scripts/audit.py video.mp4 72        # 视频帧和静帧逐帧对比，flagged 必须为 0
```

手机版：`ffmpeg -i final.mp4 -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart final_phone.mp4`。

## 审片清单

每张关键帧都检查：

1. 主体够大，或者被边缘裁切。四周没有大片空白。
2. 当前讲到的项最亮，镜头在它附近。
3. 一帧最多 2 个标签。
4. 没有东西被字幕（屏幕 y 905–960）、画中画、台标和 AI 标注挡住。
5. 没有方框字（缺字形）、没有换行成竖排的词、没有溢出卡片的字。
6. 数字、单位和原文与事实文件一致，来源行存在，CC BY 照片有署名。截图里没有未模糊的图片社照片，Logo 没被改色或变形。
7. 白纸场景和深色场景交替出现。

## 已知陷阱

- 关键词在句首时，`S.k(词, -0.3)` 会早于片段起点。用 `max(S.t0, …)` 截住。
- `formula6` 的 token 列宽等于 `iw`。`iw` 必须 ≥ 字数 × `fs`。
- 屏幕 x = (世界 x − 镜头 x) × s + 960。`piprect` 占屏幕 x 110–560，主体放在 ≥ 600 的位置。改镜头位置时，主体在屏幕上的位置也跟着变。
- `ui` 结果单位默认是"元/月"，用 `u=` 改。
- `paper` 卡底边的屏幕 y 要 ≤ 900。
- `ent6` 国旗只有 `cl` `cn` `de` `fr` `jp` `us`。
- 图片路径不存在时，该帧渲染失败（`FAIL ... Error loading image`）。先用 `ls public/<路径>` 确认。
- 静帧正常不代表视频正常。整片之后必须跑 `audit.py`。
- 渐变立体字超过 600px 会让 Chrome 卡住。不要去掉 `GText` 的层数和模糊上限。
- zsh 不会按空格拆分未加引号的变量：`node render.mjs stills out $FR` 会报 `Frame NaN`。写 `${=FR}`，或者用上面的 `xargs` 写法。
- `web_shot.mjs` 并行拍多个页面时，每个进程用不同的 `--port`。Commons 接口连续请求会返回 429，`commons_logo.py` 已经自动退避重试。
- 换了截图文件后，`add_web` 的标记坐标来自新的 `.boxes.json`。重拍时 `--boxes` 写全原来的短语，并对比新旧 JSON。

## 使用边界

- 这是风格复刻工具。成片保留 `brand.label` 的"AI 生成 · 非本人"标注，不要去掉。
- `brand.logo` 默认为空。填用户自己的台标；不要填"小Lin说"或其他真实创作者的台标后公开发布。
- 不要用真实创作者的肖像或声音生成出镜画面后公开发布。
- 不要把成片当成本人作品发布，也不要用来误导观众。
- 上屏的数据、原文和政策条文，都要能追溯到来源。
