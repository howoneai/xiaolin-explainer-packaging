# 画法：每期按选题定制

`layouts.md` 里的版式只是骨架，管坐标轴、箭头、扇区、航线、排布、入场和高亮节奏。一个场景能不能算"这一期的画面"，看的是骨架上放了什么：本期选题的真实画面，加上为本期专门画的道具和动作。

只换数据、不换画法，每期的画面会长得一样，像 PPT 模板。这一步不能省。

## 1. 她原片里什么固定、什么按选题变

对照《内存暴涨》和《洗钱》两期原片的全部图形画面，结论如下。

固定的（家族样式，不随选题变）：深色斜卡加中英标题、实体卡（国旗章加 Logo）、白卡图表（真实数据的折线、堆叠柱、环形图）、文档页荧光笔、章节卡。

按选题变的：

1. **背景**：图形几乎都压在本期相关的真实画面上（压暗或虚化）。KOSPI 环形图压在交易大厅照片上，DRAM 片名压在芯片照片上；也会用选题符号做底，比如日本段用黄色放射线和红日。用固定主题底图的时候不多。
2. **比喻角色和插画**：讲洗钱时用"小坏蛋"卡通人物和钞票堆讲概念；日本 DRAM 五家公司的卡片背后站着两个相扑手；韩国三家财阀背后是三条龙。
3. **真实素材比例高**：新闻画面、档案照片、工厂、产品图、人物照、报道原文、公司 Logo。

所以每期要做的是画法设计：骨架保持家族样式，每个场景定下背景画面、比喻角色或道具、真实素材。

## 2. 画法设计表（写分镜之前必须先写）

每个图形场景写一行：

| 场景 | 台词要点 | 数据 | 骨架 | 背景（选题真实画面） | 道具和动作（选题隐喻） |
|---|---|---|---|---|---|

咖啡演示的设计表（对应 `templates/scenes_treat.py` 的 G1–G8）：

| 场景 | 骨架 | 背景 | 道具和动作 |
|---|---|---|---|
| 价格十年 | `line6` | 咖啡豆特写照片 | 咖啡豆小人骑在线头往上爬（`rider`） |
| 咖啡馆历史 | `timeline6` | 17 世纪伦敦咖啡馆版画（公有领域） | 每个事件配实物：老咖啡馆、滤杯、绿杯、蓝杯 |
| 一杯的成本 | `pie6` | 咖啡馆吧台照片 | 把拿铁俯视图切成 4 块（`img`），讲到豆子时那一块推出来 |
| 产业链 | `flow6 bare` | 种植园照片 | 咖啡树 → 农民 → 烘焙机 → 货轮 → 拿铁，只留实物和箭头，不要卡片 |
| 利润拆解 | `tree6` | 咖啡师照片 | 节点配道具：钱袋、收银机、外带杯、甜点、麻袋、房东、咖啡师 |
| 产地和运输 | `map6` | 集装箱港口照片 | 货轮沿航线开（`vehicle`，边开边画线），巴西和越南放麻袋（`pts.img`） |
| 精品店和连锁店 | `vs6` | 街景照片 | 两张卡各放店面插画（`pic`），杯数用杯子排成一排，2 个对 10 个（`row`） |
| 品牌的关系 | `graph6` | 咖啡馆照片 | 节点换成角色：拿铁杯、投资人、农民、加盟店；供豆的边上跑麻袋，管理费的边上跑金币 |

换一个选题，骨架可以一样，画法要完全不同（同一文件的 O1–O3，OpenClaw 选题）：

| 场景 | 骨架 | 画法 |
|---|---|---|
| 36.8% 的 skill 有漏洞 | `stack6` 网格 | 100 个 skill 包，37 个变成冒绿色毒液的包，其余变灰 |
| 接进 20 多个聊天软件 | `graph6` | 中间是龙虾管家，四周是真实 Logo，信封沿每条边流向龙虾 |
| "confirm before acting" 之后删光了收件箱 | `prop` + `comment` | 当事人原话卡，龙虾换成发疯的姿势，信封一封接一封飞进垃圾桶，盖"删光了"章 |

写表时检查：

- **每个图形场景都要有本期专属的东西**：选题照片、本期道具、真实 Logo 或截图，至少一样。只有骨架和数字的场景不合格。
- **道具要承担意思**，不能只做装饰：骑在线头上的小人表示"价格在爬"，被切开的拿铁表示"一杯钱的去向"，变毒的包表示"有漏洞"。拿掉道具之后意思变弱，才算选对了。
- **相邻场景的画法不重样**：同一种动作（沿线走、切开、堆叠、流动）不要连续出现。
- **找她原片里的同类画面并排对比**：图形语言要像她，选题元素要比通用模板多。

## 3. 背景：选题的真实画面

```python
def photo_bg(src, dim=0.55, blur=3, **kw):
    d = {'type': 'broll', 'img': src, 'dim': dim, 'blur': blur, 's0': 1.06, 's1': 1.13}
    d.update(kw); return d
sc = Scene('g_line', t0, photo_bg('photos/coffee/beans.jpg', dim=0.5, blur=2))
```

- `broll` 背景可以是照片（`img`）或视频（`src`），会慢推（`s0` 到 `s1`），`dim` 是压暗程度，`blur` 是虚化像素，`sat` 是饱和度。浅色主题（`press`、`desk`、`editorial`）下 `dim` 自动变成亮色蒙版，墨色字照样看得清。想在浅色主题里也压暗，就加 `dark=True`。
- 照片来源：`scripts/commons_photo.py search/get`，只收公有领域、CC0、CC BY、CC BY-SA。署名写进事实文件，并在画面底部加一行小字（`scenes_treat.py` 的 `credit()`）。
- 报告、报道、GitHub 页面的截图（`scripts/web_shot.mjs`）也可以压暗做底。截图不随技能分发（页面有版权），每期自己截。
- 照片是背景，不是主体：`dim` 0.5–0.7，`blur` 2–6。主体仍是骨架和道具。

## 4. 道具：为本期生成

用 `generate_image`（`gpt-image-2.5`，`transparent_background` 非空，输出 `.png`）生成透明 PNG，放进 `public/props/<选题>/`，缩到 800 像素以内。

**画风由主题决定，画什么由选题决定。** 提示词 = 选题主体描述 + 主题画风后缀。

| 主题 | 画风后缀（英文提示词，接在主体描述后面） |
|---|---|
| `finance` | Cute 2.5D cartoon sticker illustration: soft gradient shading, gentle highlights, thin dark-brown outlines, rounded chunky shapes, warm saturated colors. Single isolated subject, centered, no text, no letters, no background, no ground shadow. |
| `press` | Vintage newspaper engraving illustration, black ink cross-hatching on transparent background, slight halftone dots, single isolated subject, no text, no background. |
| `blueprint` | Technical line drawing in thin white strokes like an engineering blueprint sketch, isometric, no fill, single isolated subject, no text, no background. |
| `terminal` | Chunky 16-bit pixel art sprite, limited palette of phosphor greens, crisp pixels, single isolated subject, no text, no background. |
| `desk` | Studio product photo of a real physical object, soft top light, cut out on transparent background, no shadow, no text. |
| `editorial` | Flat editorial illustration with bold black outlines and 2–3 flat spot colors, single isolated subject, no text, no background. |

- 一致性：同一期的道具用同一个画风后缀。需要同一角色的另一个姿势时，把原图作为参考图传给 `generate_image`，提示词写"same character, same style, now ……"。演示里发疯龙虾和带毒的包就是这样从原图改出来的。
- 方向：要沿路径移动的道具（货轮、汽车、飞机）在提示词里写明朝向（"bow pointing right"）。`orient` 和 `autoflip` 会处理转向。
- 要切开的实物（`pie6 img`）要生成正俯视、圆形、充满画面的图（"perfectly top-down view, circular, filling the frame"）。
- 限流：一次调用最多 5 张，多批之间不要并发。
- 不要生成品牌 Logo 和真人肖像。品牌用 `scripts/commons_logo.py` 拿真实 Logo，人物用 Commons 上可用的照片。
- 道具图标注为 AI 生成，写进事实文件的素材清单。

## 5. 素材槽速查

每个骨架上能放什么（参数细节见 `layouts.md`）：

| 骨架 | 素材槽 |
|---|---|
| `line6` | `series[i].rider = dict(src, w, orient, hop, ay)`：道具骑在线头上，跟着 `reveal` 往前走 |
| `timeline6` | `items[i].icon`：每个事件配一个实物 |
| `pie6` | `img`（正俯视实物图，按扇区切开）、`tint`（扇区色叠加强度，默认 0.2） |
| `flow6` | `bare=True`（不画卡片，只留实物、标签和箭头）、`steps[i].img` |
| `tree6` | 节点 `icon` |
| `map6` | `routes[i].vehicle = dict(src, w, orient, stay, loop, sp)`：载具沿航线开、边开边画线，到港后淡出（`stay=True` 留下）；`pts[i].img` 和 `iw`：用道具代替圆点 |
| `vs6` | `a/b.pic`（每侧的插画）、`a/b.row = dict(src, n, t, iw, dt)`（一排象形图标） |
| `graph6` | 节点 `img` 和 `iw`（角色节点，不画方块）、`mv`（节点移动）；边 `dot` 和 `dw`（沿边流动的道具，代替圆点） |
| `prop` | 单个道具：待机动作、沿路径移动、成串流动，见 `layouts.md` 的 `prop` |
| `stack6` | 象形图：柱状（每 N 个单位一个道具）或网格（其中一部分换成另一张图） |

## 6. 审片时多看三点

1. 遮住道具和背景，只看骨架：如果和别的选题没有区别，说明画法没做。
2. 道具的画风和主题一致，同一期的道具看起来是一套。
3. 照片署名在画面上，道具不压字幕（屏幕 y 905–960）。
