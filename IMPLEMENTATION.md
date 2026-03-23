# IMPLEMENTATION.md

## 当前状态

项目已完成角色列表首页当前版本，实现搜索与卡片信息展示，可直接运行。

## 版本快照

- 当前定稿版本号：`GF2-UI-20260323-01`
- 定稿说明：角色详情页当前版式、图片两倍显示规则、首屏尺寸稳定、PNG 下载基础可用性与当前确认过的定稿状态
- 上一版版本号：`GF2-UI-20260322-01`
- 当前保存版本号：`GF2-UI-20260322-01`
- 快照目录：[/D:/gf2-wiki/snapshots/GF2-UI-20260322-01](/D:/gf2-wiki/snapshots/GF2-UI-20260322-01)
- 上一个可回退版本：`GF2-UI-20260321-13`
- 保存内容：首次定稿版本，包含当前首页样式、角色详情页主题美术、PNG 下载、图片目录规则、图集完整读取、按数量自动分栏、01/02 小图合并、1500/500 尺寸门槛、主题色块内嵌色码显示、图集刷新排版一致性修复，以及发布前定稿状态
- 回退方式：后续如果你要回到这个版本，直接告诉我 `回到 GF2-UI-20260322-01`，我会从该快照恢复对应文件

## 维护入口

后续补角色资料时，优先修改以下位置：

- 表格主资料：[/D:/gf2-wiki/data/characters.csv](/D:/gf2-wiki/data/characters.csv)
- 空白模板：[/D:/gf2-wiki/data/characters.template.csv](/D:/gf2-wiki/data/characters.template.csv)
- 角色资料输出：[/D:/gf2-wiki/data/characters.json](/D:/gf2-wiki/data/characters.json)
- 角色详情主资料：[/D:/gf2-wiki/data/character-details.csv](/D:/gf2-wiki/data/character-details.csv)
- 角色详情模板：[/D:/gf2-wiki/data/character-details.template.csv](/D:/gf2-wiki/data/character-details.template.csv)
- 角色详情输出：[/D:/gf2-wiki/data/character-details.json](/D:/gf2-wiki/data/character-details.json)
- 类型定义：[/D:/gf2-wiki/lib/types.ts](/D:/gf2-wiki/lib/types.ts)
- 角色卡片展示：[/D:/gf2-wiki/components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- 列表筛选逻辑：[/D:/gf2-wiki/components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)
- 图片资源目录：`public/images/`
- 导入脚本：[/D:/gf2-wiki/scripts/import-characters.mjs](/D:/gf2-wiki/scripts/import-characters.mjs)
- 详情导入脚本：[/D:/gf2-wiki/scripts/import-character-details.mjs](/D:/gf2-wiki/scripts/import-character-details.mjs)
- 字段说明：[/D:/gf2-wiki/data/CHARACTER_COLUMNS.md](/D:/gf2-wiki/data/CHARACTER_COLUMNS.md)
- 详情字段说明：[/D:/gf2-wiki/data/CHARACTER_DETAIL_COLUMNS.md](/D:/gf2-wiki/data/CHARACTER_DETAIL_COLUMNS.md)

图片补充方式：

1. 将角色图片放入 `public/images/`
2. 可在 `data/characters.csv` 的 `image` 字段写入站内路径，例如 `/images/6.webp`
3. 若 `image` 留空，脚本会自动使用 `/images/<id>.webp`
4. 若未来要加入更多字段，再同步更新 `lib/types.ts`

表格维护流程：

1. 先编辑 `data/characters.csv`
2. 每个角色占一行
3. 修改完成后执行 `npm run import:characters`
4. 脚本会自动覆盖生成 `data/characters.json`
5. 页面继续从 `data/characters.json` 读取资料
6. 若要从零开始建表，可先复制 `data/characters.template.csv`
7. 未填写完整的草稿列会被导入脚本自动跳过，不会进入站点 JSON
8. 目前只要填写 `id` 与 `name_zh` 就可先导入，日文名、英文名可后补
9. 若 `public/images/` 已存在按角色 `id` 命名的图片文件，可批量将 `data/characters.csv` 的 `image` 欄回填为 `/images/<id>.png`

## 已实现功能

### 0. 列表页结构升级

- 首页改为更接近参考 Wiki 的角色列表页
- 角色卡片当前仅保留图片与名称信息，且名称显示以日文为主
- 保留名称搜索，移除页面上的筛选按钮区域与卡片附加信息，维持更简洁的列表界面
- 调整版面密度，缩短顶部区域并让卡片列表更紧凑

### 0.2 视觉风格改版

- 在不改变页面内容结构的前提下，参考官方站 `https://gf2.haoplay.com/tw/` 的视觉方向进行美术调整
- 将全站主色改为深海军蓝、冷青色描边与少量金属金点缀
- 首页 Hero、列表容器、搜索框、计数按钮与角色卡片统一改为偏军事科幻的深色半透明面板风格
- 保留当前文案与交互，仅调整配色、背景、边框、阴影与氛围
- 本次视觉变更主要集中在下列文件，若后续不满意，可优先回退这些文件的样式类名与 CSS 变量：
- [app/globals.css](/D:/gf2-wiki/app/globals.css)
- [app/page.tsx](/D:/gf2-wiki/app/page.tsx)
- [components/SearchBar.tsx](/D:/gf2-wiki/components/SearchBar.tsx)
- [components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)
- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- [components/CharacterGrid.tsx](/D:/gf2-wiki/components/CharacterGrid.tsx)

验证步骤：

1. 启动 `npm run dev`
2. 刷新首页
3. 确认页面内容结构未变，仅整体色调与卡片风格改变
4. 确认搜索框、按钮、卡片在深色背景上仍清晰可读

验证结果：

- 已完成样式改版
- 待你目视确认是否保留此版视觉方向

### 0.3 Endfield 风格重构

- 在不改变当前文字与功能的前提下，参考 `https://endfield.gryphline.com/` 的官方视觉语言进行第二轮 UI 重构
- 由于指定 landing 页无法直接抓取页面结构，本次为基于官方公开视觉方向的推定式实现
- 视觉重点改为浅色工业科幻面板、暖灰背景、橘铜色强调线、硬边裁角与更干净的层次
- 本轮主要修改全局背景、Hero、区块容器、搜索框、按钮与角色卡片风格
- 若不满意，可直接回退到版本快照 `GF2-UI-20260321-01`

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)
- [app/page.tsx](/D:/gf2-wiki/app/page.tsx)
- [components/SearchBar.tsx](/D:/gf2-wiki/components/SearchBar.tsx)
- [components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)
- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- [components/CharacterGrid.tsx](/D:/gf2-wiki/components/CharacterGrid.tsx)

验证步骤：

1. 启动 `npm run dev`
2. 刷新首页
3. 确认页面内容结构与功能保持不变
4. 确认整体风格改为浅色工业科幻风，而非上一版深蓝半透明风

验证结果：

- 已完成样式重构
- 待你目视确认是否继续沿用此方向

### 0.4 黑底科技风微调

- 在 0.3 的基础上，依需求将整体视觉进一步切换为黑底科技终端风格
- 主背景改回深黑与深蓝黑渐层
- 面板、搜索框、按钮、卡片统一改为深色模块，并保留冷蓝高光与少量橙色警示线
- Hero 改为更一体化的深色科技面板，减少分裂感

验证步骤：

1. 启动 `npm run dev`
2. 刷新首页
3. 确认整体背景为黑色科技风格
4. 确认 Hero、搜索框、按钮与卡片全部回到深色系但仍可清晰辨识

验证结果：

- 已完成黑底科技风微调
- 待你目视确认是否继续沿用此方向

### 0.5 明日方舟官网风格收敛

- 参考 `https://ak.hypergryph.com/` 的官方站视觉语言，对黑底科技风进一步收敛
- 减少花哨渐层与过多发光，改为更干净、冷硬、情报终端式的页面风格
- 强调黑灰底、冷白文字、细线分割与克制的橙色点缀
- Hero、搜索框、按钮与卡片都向更简洁的信息模块方向调整

验证步骤：

1. 启动 `npm run dev`
2. 刷新首页
3. 确认页面更接近明日方舟官网的简洁情报终端感
4. 确认保留当前文本与功能不变

验证结果：

- 已完成风格收敛
- 待你目视确认是否继续沿用此方向

### 0.6 角色详情分页面与加载效果

- 新增角色详情页路由 `app/characters/[id]/page.tsx`
- 首页角色卡片现在可点击进入详情页
- 详情页版型参考用户提供的角色资料图，采用当前黑色科技风样式重做
- 详情页上半部已调整为更接近参考图的档案区块风格，改为日文主显示并加入简介条、信息条与档案编号模块
- 详情页右上角下载按钮已由 `PDF` 改为 `PNG`，会将当前角色详情页导出为单张 PNG 图片下载
- 详情页上方信息列已精简为 `中国語/英語 / 声優 / 身高 / テーマカラー` 四个栏位，并移除右侧补充说明面板
- 详情页主标题下方的中文副名称已移除，仅保留日文主名称
- 详情页主标题区已微调垂直间距，让日文主名称在区块中更靠中显示
- 详情页介绍区块标题已由 `紹介` 调整为 `キャラ紹介`
- 详情页主标题区垂直间距已再次下调一档，让日文主标题位置更靠中下
- 详情页所有无资料时的默认占位文字已统一改为 `補足待ち`
- 详情资料 CSV 与模板中的示范占位文案也已统一改为 `補足待ち`，并重新导入 `character-details.json`
- 详情页 `PDFダウンロード` 按钮中的 `PDF` 小字已改为置中对齐
- 详情页 `中国語/English` 栏位已改为直接显示角色中文名与英文名，缺值时不再显示占位字
- 详情页第一个图像区块的默认标题已由 `立绘资料` 改为 `図鑑`
- 详情页图像区块底部的说明文字列已移除，`図鑑 / Skin` 区块仅保留标题与图片
- 详情页图片区块已改为优先读取 `public/images/details/<id>/` 目录，并按 `図鑑 -> Skin1..n -> 他の参考画像 -> 武器` 的顺序自动生成区块
- `図鑑` 与 `Skin` 区块会按文件名 `01` 到 `04` 从左到右排序，若子文件夹不存在或无图片则不显示
- 已为现有角色建立 `public/images/details/<id>/` 目录骨架，并预建 `図鑑 / 他の参考画像 / 武器` 子文件夹
- 详情页 `テーマカラー` 栏位已改回统一深色面板样式，仅保留内部色块显示主题色
- 详情页文字资料表已精简，移除旧版 `section1~3` 图片相关栏位，仅保留当前仍在使用的文字与武器字段
- 详情页 `キャラ紹介` 正文已提高字色对比、字级与行高，让长段落更易阅读
- 详情页 `声優` 栏位已改回直接显示原始姓名
- 详情页左侧主图已固定沿用首页角色卡片主图，不再使用 `図鑑` 文件夹的首张图片
- 详情页资讯栏位标题 `身高` 已调整为 `身長`
- 详情页右侧图集卡片高度已提高，方便显示较高的直幅角色图片
- 详情页上方四个资讯栏位的标题字样已提高亮度、字级与字重，让栏位名称更明显
- 详情页武器区已调整为图片主导版面，左侧武器图片宽度超过一半
- 详情页右侧图集已改为更接近原图长宽比的自适应显示，横向素材会比固定直幅框更清楚
- 详情页 `他の参考画像` 区块已单独改为单栏大图模式，提升横向参考图的可视面积
- 详情页 `他の参考画像` 区块会再依图片实际长宽比自适应尺寸，避免 SD 大头过大或横图过扁
- 详情页图集图与武器图已支持点击放大预览，可点背景或 `閉じる` 关闭，也支持按 `Esc`；左侧主图不参与放大
- 详情页武器区已新增 `weapon_name_zh / weapon_name_en` 显示规则：有填则显示已填名称，完全未填时显示 `中国語/英語`
- 详情页武器区小标题 `武器名` 已提高亮度、字级与字重，让标题更明显
- 详情页武器区已移除 `中国語/英語` 次名称显示列，仅保留主武器名与说明内容
- 详情页武器区次名称内容列已恢复，但不再显示 `中国語/英語` 标题；未填时显示 `補足待ち`
- 详情页武器主名称下方一行已改为显示武器中文/英文名；若都未填，则固定显示 `中国語/English`
- 详情页武器区已移除 `中国語/English` 下方的内容列，仅保留标签与最下方说明框
- 详情页武器主名称下方现固定显示武器中文/英文名称列；说明文字仅保留在最下方框内
- 详情页武器区已进一步精简为仅保留 `中国語/English` 标签本身，不再显示其下方额外内容列
- 新增 `data/character-details.csv` 与 `data/character-details.template.csv`，用于维护详情页文字与图片区块
- 新增 `npm run import:character-details`，把详情 CSV 转成 JSON
- 若详情 CSV 中图片区块为空，页面会先用角色主图兜底，方便逐步补资料
- 新增 `app/characters/[id]/loading.tsx`，在跳转详情页时显示橘色加载条风格页面

涉及文件：

- [app/characters/[id]/page.tsx](/D:/gf2-wiki/app/characters/[id]/page.tsx)
- [app/characters/[id]/loading.tsx](/D:/gf2-wiki/app/characters/[id]/loading.tsx)
- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)
- [components/PdfDownloadButton.tsx](/D:/gf2-wiki/components/PdfDownloadButton.tsx)
- [data/character-details.csv](/D:/gf2-wiki/data/character-details.csv)
- [data/character-details.template.csv](/D:/gf2-wiki/data/character-details.template.csv)
- [data/character-details.json](/D:/gf2-wiki/data/character-details.json)
- [data/CHARACTER_DETAIL_COLUMNS.md](/D:/gf2-wiki/data/CHARACTER_DETAIL_COLUMNS.md)
- [lib/character-detail-assets.ts](/D:/gf2-wiki/lib/character-detail-assets.ts)
- [scripts/import-character-details.mjs](/D:/gf2-wiki/scripts/import-character-details.mjs)
- [lib/types.ts](/D:/gf2-wiki/lib/types.ts)
- [package.json](/D:/gf2-wiki/package.json)

验证步骤：

1. 编辑 `data/character-details.csv`
2. 执行 `npm run import:character-details`
3. 启动 `npm run dev`
4. 在首页点击任一角色卡片
5. 确认可跳转到角色详情页
6. 确认跳转过程中出现橘色 loading 条风格画面
7. 在 `public/images/details/<id>/図鑑/` 中放入 `01.png` ~ `04.png`
8. 刷新角色详情页，确认 `図鑑` 区块按编号从左到右显示
9. 新建 `Skin1` 或 `他の参考画像` 文件夹并放入图片，确认页面会自动新增对应区块
10. 执行 `npm run import:character-details`，确认精简后的 CSV 仍可正常导入
11. 点击角色详情页中的主图、图集图或武器图，确认会弹出放大预览
12. 点击右上角 `PNG ダウンロード`，确认会下载当前详情页的 PNG 图片

验证结果：

- 已完成代码实现
- 待执行脚本与页面跳转验证

### 0.1 表格化角色资料管理

- 新增 `data/characters.csv` 作为角色表格主资料源
- 新增 `data/characters.template.csv` 作为空白模板
- 新增 `data/CHARACTER_COLUMNS.md` 作为字段说明
- 新增 `scripts/import-characters.mjs`，负责把 CSV 转成站点使用的 JSON
- 新增 `npm run import:characters` 命令
- `id` 改为数字管理
- 表格字段精简为 `id / name_zh / name_ja / name_en / image`
- `image` 为空时自动按 `id` 生成 `/images/<id>.webp`
- 只填写 `id + name_zh` 的角色也可导入，方便先补图与中文名
- 卡片名称显示优先用日文，若日文为空则回退显示中文
- 仍然完全空白的草稿列会自动跳过
- 目前已把现有角色数据同步到 CSV 中

涉及文件：

- [data/characters.csv](/D:/gf2-wiki/data/characters.csv)
- [data/characters.template.csv](/D:/gf2-wiki/data/characters.template.csv)
- [data/CHARACTER_COLUMNS.md](/D:/gf2-wiki/data/CHARACTER_COLUMNS.md)
- [data/characters.json](/D:/gf2-wiki/data/characters.json)
- [scripts/import-characters.mjs](/D:/gf2-wiki/scripts/import-characters.mjs)
- [package.json](/D:/gf2-wiki/package.json)

验证步骤：

1. 编辑 `data/characters.csv`
2. 执行 `npm run import:characters`
3. 打开 `data/characters.json`
4. 确认 JSON 内容与 CSV 一致

验证结果：

- 待执行脚本验证

涉及文件：

- [app/page.tsx](/D:/gf2-wiki/app/page.tsx)
- [components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)
- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- [components/CharacterGrid.tsx](/D:/gf2-wiki/components/CharacterGrid.tsx)
- [data/characters.json](/D:/gf2-wiki/data/characters.json)
- [lib/types.ts](/D:/gf2-wiki/lib/types.ts)

验证步骤：

1. 启动 `npm run dev`
2. 打开首页
3. 确认顶部仍可输入中、日、英名称搜索
4. 确认搜索框下方不再出现品质、职能、武器筛选按钮区
5. 确认卡片仅显示角色图片与日文名称

验证结果：

- 已完成代码实现
- 页面结构已按需求简化
- 待执行 `npm run build` 做最终构建验证

### 1. 项目基础搭建

- 使用 `Next.js`
- 使用 `Tailwind CSS`
- 使用 `TypeScript`
- 建立 `app router` 目录结构

涉及文件：

- [package.json](/D:/gf2-wiki/package.json)
- [tailwind.config.ts](/D:/gf2-wiki/tailwind.config.ts)
- [postcss.config.js](/D:/gf2-wiki/postcss.config.js)
- [tsconfig.json](/D:/gf2-wiki/tsconfig.json)
- [next.config.ts](/D:/gf2-wiki/next.config.ts)

### 2. 首页角色搜索

- 首页顶部提供搜索框
- 支持中文、日文、英文名称匹配
- 搜索逻辑在客户端执行

涉及文件：

- [app/page.tsx](/D:/gf2-wiki/app/page.tsx)
- [components/SearchBar.tsx](/D:/gf2-wiki/components/SearchBar.tsx)
- [components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)

### 3. 角色卡片与列表展示

- 卡片仅显示图片和名字
- 列表采用响应式网格布局
- 无结果时显示空状态

涉及文件：

- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)
- [components/CharacterGrid.tsx](/D:/gf2-wiki/components/CharacterGrid.tsx)

### 4. 数据来源

- 数据来自 `data/characters.json`
- 已定义统一 `Character` 类型

涉及文件：

- [data/characters.json](/D:/gf2-wiki/data/characters.json)
- [lib/types.ts](/D:/gf2-wiki/lib/types.ts)

## 验证记录

已执行：

- `npm install`
- `npm run build`

结果：

- 依赖安装成功
- 生产构建成功

## 本地运行步骤

```bash
cd D:\gf2-wiki
npm run dev
```

打开：

```text
http://localhost:3000
```

## 手动验证步骤

1. 打开首页，确认顶部有搜索框。
2. 确认下方显示角色卡片列表。
3. 输入中文名称，例如 `格罗扎`，确认能筛选结果。
4. 输入日文名称，例如 `ネメシス`，确认能筛选结果。
5. 输入英文名称，例如 `Suomi`，确认能筛选结果。
6. 输入不存在的关键字，确认显示空状态。

## 下次功能开发要求

后续每完成一个功能后，必须在本文件追加：

- 功能名称
- 涉及文件
- 实现说明
- 验证步骤
- 验证结果

## 5. 项目文档补齐

- 新增 `README.md`
- 补充项目说明、目录结构、安装运行方式、数据格式、组件说明与验证步骤
- 将协作入口统一到 `AGENTS.md` 与 `IMPLEMENTATION.md`

涉及文件：

- [README.md](/D:/gf2-wiki/README.md)
- [IMPLEMENTATION.md](/D:/gf2-wiki/IMPLEMENTATION.md)

验证步骤：

1. 打开 `README.md`
2. 确认包含安装、运行、构建、数据格式、验证步骤
3. 确认文档内容与当前项目结构一致

验证结果：

- `README.md` 已创建
- 文档内容与当前项目实现一致

## 6. 角色详情页主题美术重设计

- 在不改动文字、功能、资料结构的前提下，重做角色详情页的整体美术主题
- 视觉方向调整为更适合《少女前线2》的冷钢灰、战术黑与橘色警示点缀
- 重新设计外层背景、主容器、区块标题、资讯卡、图框、返回键、PNG 按钮与预览弹窗的视觉语言
- 保留现有交互逻辑、下载功能、图片放大与资料读取规则不变

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)
- [components/PdfDownloadButton.tsx](/D:/gf2-wiki/components/PdfDownloadButton.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认文字、资料、图片、PNG 下载与放大预览功能保持不变
5. 确认页面已切换为统一的黑灰工业终端风格，标题、资讯卡、图框与操作按钮视觉一致

验证结果：

- 已完成主题美术替换
- 本次未执行 `npm run build`

## 7. 角色详情页图片框单层化

- 移除角色详情页主图、图集与武器图卡片的内层假框线
- 保留外层框线与现有功能不变，避免出现双重框视觉

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认主图、`図鑑`、`Skin` 与武器图都只保留单层外框

验证结果：

- 已完成单层框样式调整
- 本次未执行 `npm run build`

## 8. 角色详情页左侧渐层清理

- 移除角色详情页左侧与返回按钮、标题列上的橘色渐层带
- 调整为纯色细线与单色点缀，保留原有布局、文字与功能不变

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认页面左侧、返回按钮与标题列不再出现大面积橘色渐层，只保留干净的橘色线条点缀

验证结果：

- 已完成左侧渐层清理
- 本次未执行 `npm run build`

## 9. 角色详情页主标题视觉重设

- 移除顶部 `キャラクタープロフィール` 下方的橘色底线
- 将主标题区调整为更接近游戏 Logo 的视觉表现：小标题改为标签牌样式，主名称改为更强烈的标题字效果
- 保持原有文字内容、功能与布局结构不变

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认顶部主标题区不再有橘色短线，且 `キャラクタープロフィール` 与角色名有更强的主题标题感

验证结果：

- 已完成主标题视觉调整
- 本次未执行 `npm run build`

## 10. 角色详情页主题标示橘色强化

- 将顶部 `キャラクタープロフィール` 与资讯栏小标题统一调整为橘色粗体
- 保留原有文字内容与功能，仅强化主题标示层级

涉及文件：

- [app/globals.css](/D:/gf2-wiki/app/globals.css)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认顶部小标与 `中国語/English`、`声優`、`身長`、`テーマカラー` 等标题已变为橘色粗体

验证结果：

- 已完成主题标示颜色与字重强化
- 本次未执行 `npm run build`

## 11. 角色详情页主题标示字级放大

- 提高顶部 `キャラクタープロフィール` 与资讯栏标题的字级
- 让主题标示更明显，同时保留原有文字内容与功能不变

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认顶部小标与 `中国語/English`、`声優`、`身長`、`テーマカラー`、`武器名` 的字级比之前更大

验证结果：

- 已完成主题标示字级放大
- 本次未执行 `npm run build`

## 12. 图鉴与 Skin 图集五栏放大

- 将 `図鑑` 与 `Skin` 图集改为五栏显示
- 提高图集卡片最小高度，并依据该组图片比例动态调整卡片高度
- `他の参考画像` 维持原本单栏自适应显示逻辑不变

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有五张 `図鑑` 或 `Skin` 图片的角色详情页
4. 确认图集为五栏显示，且图片卡片高度比之前更大、更清楚

验证结果：

- 已完成五栏图集与尺寸放大调整
- 本次未执行 `npm run build`

## 13. 图集按图片数量自动分栏

- `図鑑` 与 `Skin` 图集改为依图片数量自动决定栏数
- 1 张为 1 栏，2 张为 2 栏，3 张为 3 栏，4 张为 4 栏，5 张以上为 5 栏
- `他の参考画像` 维持原本单栏显示逻辑不变

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有 3 张、4 张、5 张图片的 `図鑑` 或 `Skin` 图集
4. 确认图集会分别自动显示为 3 栏、4 栏、5 栏

验证结果：

- 已完成按图片数量自动分栏
- 本次未执行 `npm run build`

## 14. 图集读取数量限制移除

- 移除 `図鑑` 与 `Skin` 图集原本只读取前 4 张图片的限制
- 现在图集会完整读取对应资料夹中的所有图片，再配合自动分栏规则显示

涉及文件：

- [lib/character-detail-assets.ts](/D:/gf2-wiki/lib/character-detail-assets.ts)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 在任一角色的 `図鑑` 或 `Skin` 资料夹中放入第 5 张图片
4. 打开该角色详情页，确认第 5 张图片会正常显示

验证结果：

- 已移除图集前 4 张限制
- 本次未执行 `npm run build`

## 15. 图集前两张低解析度自动堆叠

- 当 `図鑑` 或 `Skin` 的前两张图片解析度明显偏低时，自动将这两张合并为同一栏上下显示
- 用于避免两张小图各自占满一栏时看起来过空
- `他の参考画像` 不套用此规则

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 在 `図鑑` 或 `Skin` 中放入前两张较小解析度图片
4. 打开角色详情页，确认前两张会自动变成同一栏上下排列

验证结果：

- 已完成低解析度首两张自动堆叠规则
- 本次未执行 `npm run build`

## 16. 图集图片按比例自动放大

- 为 `図鑑` 与 `Skin` 图集新增按图片比例自动放大显示的规则
- 对过瘦、看起来过小的图片自动提高显示倍率，极端情况可放大到 2 倍
- 目标是在保持完整可见的前提下，减少栏位中过多空白

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开包含瘦长小图的 `図鑑` 或 `Skin` 图集
4. 确认这类图片会比之前显示得更大，栏位空白明显减少

验证结果：

- 已完成图集图片按比例自动放大
- 本次未执行 `npm run build`

## 17. 图集放大规则加入 1500 门槛

- 收紧 `図鑑` 与 `Skin` 图集的自动放大条件
- 只有图片原始宽或高超过 `1500` 时，才会启用放大倍率
- 低于 `1500` 的图片维持原本大小，避免被放得过大

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开同时包含高解析度与中低解析度图片的 `図鑑` 或 `Skin` 图集
4. 确认只有原图宽或高超过 `1500` 的图片会被自动放大

验证结果：

- 已完成 1500 门槛限制
- 本次未执行 `npm run build`

## 18. 01 与 02 小图优先合并

- 调整 `図鑑` 与 `Skin` 的前两张图片合并规则
- 不再只依赖低解析度判断，而是同时参考 01/02 的构图比例与后续是否存在较高的人物图
- 符合条件时固定将 `01` 放上方、`02` 放下方

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开前两张为小头像、后续为半身或全身图的 `図鑑` 或 `Skin`
4. 确认 `01` 与 `02` 会合并成同一栏，上下排列，且 `01` 在上、`02` 在下

验证结果：

- 已完成 01/02 小图优先合并规则
- 本次未执行 `npm run build`

## 19. 图集尺寸门槛规则固定化

- 将 `図鑑` 与 `Skin` 的图片放大规则改为固定门槛
- 当图片原始宽或高大于 `1500` 时，自动放大 `2.5` 倍
- 当 `01` 或 `02` 的原始宽高最大边小于 `500` 时，自动合并为同一栏，`01` 在上、`02` 在下

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开包含超大图与小头像图的 `図鑑` 或 `Skin`
4. 确认大于 `1500` 的图片会放大 `2.5` 倍
5. 确认 `01` 或 `02` 小于 `500` 时会自动合并为上下排列

验证结果：

- 已完成固定尺寸门槛规则
- 本次未执行 `npm run build`

## 20. テーマカラー支持多色码

- `テーマカラー` 改为支持最多三个色码
- 输入格式使用逗号分隔，例如 `#F69260,#7CB0DF,#FFFFFF`
- 页面会分别显示最多三个色块，并保留原始色码文字

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 在 [data/character-details.csv](/D:/gf2-wiki/data/character-details.csv) 的 `theme_color` 填入最多三个逗号分隔色码
2. 执行 `npm run import:character-details`
3. 打开对应角色详情页
4. 确认 `テーマカラー` 会显示最多三个色块，并显示完整色码字符串

验证结果：

- 已完成多色码显示支持
- 本次未执行 `npm run build`

## 21. テーマカラー色码内嵌显示

- `テーマカラー` 的色码文字改为直接显示在色块内部
- 色块会根据颜色明暗自动切换浅色或深色文字，提升可读性
- 外部独立色码文字已移除

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 在 [data/character-details.csv](/D:/gf2-wiki/data/character-details.csv) 的 `theme_color` 填入一个或多个色码
2. 执行 `npm run import:character-details`
3. 打开对应角色详情页
4. 确认色码文字直接显示在色块内部，且可正常辨识

验证结果：

- 已完成色码内嵌显示调整
- 本次未执行 `npm run build`

## 22. 图集刷新排版不一致修复

- 修复角色详情页 `図鑑` / `Skin` 图集在首次进入与刷新后排版不一致的问题
- 原因是旧逻辑依赖浏览器 `onLoad` 后才取得图片尺寸，导致客户端计算时机不同
- 现改为在伺服器端预先读取每张图片的宽高，并将尺寸资料随图集一起传入页面
- 刷新与首次进入现在会使用同一份尺寸资料，排版规则保持一致

涉及文件：

- [lib/types.ts](/D:/gf2-wiki/lib/types.ts)
- [lib/character-detail-assets.ts](/D:/gf2-wiki/lib/character-detail-assets.ts)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页，记录 `図鑑` / `Skin` 的当前排版
4. 直接刷新浏览器页面
5. 确认刷新前后图集排版保持一致

验证结果：

- 已完成刷新排版不一致修复
- 本次未执行 `npm run build`

## 23. 站点页签 icon 指定角色图

- 将站点页签小图示改为使用 `public/images/details/9/図鑑/03.png`
- 同步设置 `icon`、`shortcut icon` 与 `apple touch icon`

涉及文件：

- [app/layout.tsx](/D:/gf2-wiki/app/layout.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开站点页面
4. 强制刷新浏览器页签，确认左上页签图示变为指定角色小图

验证结果：

- 已完成页签 icon 指定
- 本次未执行 `npm run build`

## 24. 站点日文标题与 PNG 匯出修正

- 将站点页签标题改为日文 `ドールズフロントライン2：エクシリウム`
- 修复 PNG 匯出时角色主标题因透明文字效果而未显示的问题
- PNG 下载文件名改为 `gf2-character-角色日文名`

涉及文件：

- [app/layout.tsx](/D:/gf2-wiki/app/layout.tsx)
- [app/globals.css](/D:/gf2-wiki/app/globals.css)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 确认浏览器页签标题显示为日文
5. 点击 `PNG` 下载按钮
6. 确认导出的图片中角色主标题正常显示，且文件名为 `gf2-character-角色日文名.png`

验证结果：

- 已完成站点标题与 PNG 匯出修正
- 本次未执行 `npm run build`

## 25. PNG 匯出文字一致性优化

- 优化 PNG 匯出流程，先等待字型载入完成与画面稳定后再执行截取
- 启用更接近浏览器原生渲染的 `foreignObjectRendering`
- 在匯出模式下收敛少数容易导致文字偏差的视觉效果，尽量让 PNG 与网页显示一致

涉及文件：

- [components/PdfDownloadButton.tsx](/D:/gf2-wiki/components/PdfDownloadButton.tsx)
- [app/globals.css](/D:/gf2-wiki/app/globals.css)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 点击 `PNG` 下载按钮
5. 对比网页与导出 PNG，确认标题、小标与区块文字的字型与位置更接近网页显示

验证结果：

- 已完成 PNG 文字一致性优化
- 本次未执行 `npm run build`

## 26. PNG 匯出完整页面修复

- 修复 PNG 匯出时只截到局部区域或内容严重错位的问题
- 匯出目标改为整个当前角色详情页主容器，而不再只截内部单一区块
- 截图尺寸改为使用目标容器自身的宽高，避免因整页文件尺寸参数导致裁切异常

涉及文件：

- [components/PdfDownloadButton.tsx](/D:/gf2-wiki/components/PdfDownloadButton.tsx)
- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一角色详情页
4. 点击 `PNG` 下载按钮
5. 确认导出的图片为当前详情页完整页面，而不是只剩局部窄条区域

验证结果：

- 已完成 PNG 完整页面匯出修复
- 本次未执行 `npm run build`

## 27. 图集卡片高度收敛

- 收敛 `図鑑` 与 `Skin` 图集卡片的最小高度
- 保留大图完整可见的前提下，减少整排卡片被过度拉高造成的上下留白

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有大图与小图混排的 `図鑑` 或 `Skin`
4. 确认图片仍能完整看到，同时卡片上下空白比之前明显减少

验证结果：

- 已完成图集卡片高度收敛
- 本次未执行 `npm run build`

## 28. 图集高度再次收紧

- 再次降低 `図鑑` 与 `Skin` 图集卡片的最小高度
- 同时降低超大图放大后的最大显示高度与倍率
- 目标是在保留完整可见的前提下，进一步减少整排图集的上下留白

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有超大图与小图混排的 `図鑑` 或 `Skin`
4. 确认整排图集高度比之前更紧凑，空白进一步减少

验证结果：

- 已完成图集高度再次收紧
- 本次未执行 `npm run build`

## 29. 发布准备与部署说明

- 确认当前项目更适合部署到 `Vercel`
- 将 `snapshots/` 加入 `.gitignore`，避免推送快照目录到远端仓库
- 新增部署说明文档，包含本地资料同步、GitHub 推送与 Vercel 发布流程

涉及文件：

- [.gitignore](/D:/gf2-wiki/.gitignore)
- [DEPLOYMENT.md](/D:/gf2-wiki/DEPLOYMENT.md)

验证步骤：

1. 打开 [DEPLOYMENT.md](/D:/gf2-wiki/DEPLOYMENT.md)
2. 确认包含 `Vercel` 发布步骤与发布前 import 步骤
3. 确认 `.gitignore` 已包含 `snapshots`

验证结果：

- 已完成发布准备说明
- 本次未执行 `npm run build`

## 30. 图集留白与垂直居中收敛

- 进一步收紧 `図鑑` 与 `Skin` 图集卡片的最小高度，避免五栏或四栏布局时出现过多上下留白
- 调低 `>1500` 高解析度图片的放大上限，改为在完整可见前提下更克制地放大
- 将图集图片从卡片内垂直居中改为靠上对齐，避免小图被放在卡片中间造成顶部与底部大块空白
- 保留 `01/02` 小图合并、按数量自动分栏与 `他の参考画像` 的单栏逻辑不变

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有小头像、半身图与高解析度全身图混排的角色详情页
4. 确认 `図鑑` 与 `Skin` 的图卡高度比之前更紧凑
5. 确认图片会靠上显示，不再在卡片中间留下大块上下空白

验证结果：

- 已完成图集留白与垂直居中收敛
- 本次未执行 `npm run build`

## 31. 图集大图放大规则恢复

- 按需求恢复 `図鑑` 与 `Skin` 的高解析度放大规则
- 当图片任一边大于 `1500` 时，改回放大 `2` 倍显示
- 保留 `01 / 02` 小图在任一边小于 `500` 时自动上下合并的规则不变
- 图集卡片中的图片对齐方式改回置中显示
- 左侧主图容器高度同步提高，让视觉上更接近右侧首个图集区块高度

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开含有任一边大于 `1500` 图片的 `図鑑` 或 `Skin`
4. 确认该图片会按规则放大 `2` 倍显示
5. 确认 `01 / 02` 小图合并规则仍然有效

验证结果：

- 已恢复图集大图放大规则
- 本次未执行 `npm run build`

## 32. PNG 导出左侧主图比例修正

- 保持页面内 `図鑑` 与 `Skin` 的既有展示规则不变，包括任一边大于 `1500` 时放大 `2` 倍
- 仅修正角色详情页导出 PNG 时左侧主图的渲染方式
- 将左侧主图改为使用原生 `img` 呈现，避免 `html2canvas` 抓取 `next/image fill` 时出现比例异常
- 为左侧主图容器补上显式 `aspect-ratio`，降低 PNG 导出时布局重算造成的比例漂移

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开角色详情页，例如 `http://localhost:3000/characters/1`
4. 点击右上角 `PNG` 下载按钮
5. 打开下载后的 PNG，确认左侧主图比例与页面显示一致，没有被拉伸或压扁
6. 确认页面中的 `図鑑` 区块仍保留原有规则，特别是大图放大逻辑没有变化

验证结果：

- 已完成 PNG 导出左侧主图比例修正
- 本次未执行 `npm run build`

## 33. 图集顺序按详情页规则固定

- 角色详情页改为在渲染前主动整理图集顺序，不再依赖 `character-details.json` 原始写入顺序
- 图集区块顺序固定为 `図鑑 -> Skin1 -> Skin2 -> ... -> 他の参考画像`
- 区块内图片也会再按档名尾端数字排序，确保 `01 -> 02 -> 03 ...` 的显示顺序稳定
- 保持 `図鑑 / Skin` 任一边大于 `1500` 时放大 `2` 倍的规则不变

涉及文件：

- [components/CharacterDetailPage.tsx](/D:/gf2-wiki/components/CharacterDetailPage.tsx)

验证步骤：

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开任一含有 `図鑑`、多个 `Skin` 与 `他の参考画像` 的角色详情页，例如 `http://localhost:3000/characters/37`
4. 确认区块显示顺序为 `図鑑 -> Skin1 -> Skin2 ... -> 他の参考画像`
5. 确认各区块内图片顺序为 `01 -> 02 -> 03 ...`
6. 点击右上角 `PNG` 下载按钮，确认左侧主图在下载后的 PNG 中没有失真

验证结果：

- 已完成详情页图集顺序固定
- 本次未执行 `npm run build`
## 2026-03-23 画像表示調整

- 当前文档记录版本：`GF2-UI-20260323-01`
- 对应项目 package 版本：`0.1.0`
- 本次状态：页面版面已按当前确认结果定稿，后续若继续调整，建议以此版本号作为回退基线
- 角色详情页图片逻辑调整为：只要任一边超过 `1500px`，图库图、参考图与左侧主视觉图都会以两倍缩放显示，提升大图可读性。
- 修正 PNG 导出时左侧角色图的固定比例问题，导出模式下改为按图片原始比例自适应，避免人物图被拉伸或框高不协调。
- 修正 PNG 导出时武器图片区块的固定 `4:3` 比例问题，改为导出时按武器图片原始比例自适应，避免横向武器被压扁。
- 调整网页中的超大图库图显示方式：不再只用 `transform scale`，改为按图片元数据直接放大实际渲染尺寸，并同步增大对应卡片高度，让超过 `1500px` 的高分辨率图片在页面里明显放大。
- 进一步调整网页图库网格：超过 `1500px` 的高分辨率图片会在详情页中横向占用更宽栏位，避免被单栏窄卡片限制，确保放大后的细长立绘也能清楚观看。
- 修正部分角色图库数据中 `width` / `height` 为 `0` 导致的大图放大规则失效问题，改为前端在图片加载后读取自然尺寸，并对超大细长图应用更大的栏位与接近三倍的展示尺寸。
- 根据页面确认结果，再次调整图库布局：取消超大图跨栏，图鉴区改为桌面端 `6` 栏排列，确保同组图片尽量维持同一排显示，同时保留较高卡片以改善细长图可视性。
- 根据最新截图要求，收敛大图特殊放大范围：`Skin` 等皮肤图库恢复统一列宽与稳定尺寸，仅在 `図鑑` / 参考图片区维持大图增强显示，保证整体排版更接近目标截图。
- 修正图鉴区空白列问题：对“前两张堆叠成一列”的 `5` 项布局恢复为 `5` 栏铺满；同时将超过 `1500px` 的图片增强显示收敛为两倍级别，不再使用更激进的放大尺寸。
- 针对图鉴区实际为 `2048x2048` 的高分辨率图片，进一步调整为桌面端占 `2` 栏显示；对应分组自动切换为 `6` 栏布局，保证大图按两倍级别放大时仍能填满整排且不留空位。
- 修正刷新后图库大图恢复变小的问题：除了 `onLoad` 事件外，组件挂载后也会主动读取已缓存图片的自然尺寸，确保重新整理页面后仍能稳定应用大图放大规则。
- 调整点击预览的灯箱行为：弹窗内图片不再额外套用放大倍率，统一维持原尺寸比例预览，避免局部被过度放大。
- 统一页面图库规则：所有分组（包含 `Skin`、`図鑑`、参考图）只要图片任一边超过 `1500px`，页面内即按两倍级别显示；点击预览仍维持原尺寸比例，不套用页面放大倍率。
- 调整详情页整体版心宽度至更宽的桌面尺寸，并取消大图跨栏，避免 `Skin` / `図鑑` 分组在套用两倍级别显示后把同排栏位挤乱，同时减少页面左右留白。
- 修正图鉴区末尾空白栏位：当前 `5` 项布局不再预留第 `6` 栏，统一按 `5` 栏自动铺满，避免最后一列留白。
- 修正 PNG 导出比例跑掉的问题：导出时不再用目标元素的 `scrollWidth` 重建更宽的虚拟窗口，而是锁定当前页面实际渲染宽度进行截图，确保下载的 PNG 与页面定稿保持一致。
- 进一步收紧 PNG 导出环境：截图时同时锁定克隆文档的 `html`、`body` 与目标元素宽度，避免 html2canvas 在克隆阶段再次触发响应式重排，进一步减少下载 PNG 与页面定稿的整体比例偏差。
- 进一步修正 PNG 图片比例：导出前会记录页面上各图片区块与图片元素的实际渲染宽高，并在克隆文档中冻结这些尺寸，确保下载 PNG 中各图片比例与页面所见一致。
- 进一步修正 PNG 长图拉伸问题：导出时仅冻结图片区块容器尺寸，不再强制锁定 `img` 元素自身高度；同时移除 `export-mode` 下对主图与武器图的额外重排样式，避免下载 PNG 中长图被二次拉伸。
- 进一步收紧 PNG 导出布局：将详情页主布局网格、图库网格、堆叠列和武器区网格也纳入导出尺寸冻结范围，减少 html2canvas 在克隆文档中重新分栏导致的整体比例偏差。
- 已撤回 `foreignObjectRendering` 导出路径，该模式在当前页面会导致 PNG 中图片资源渲染异常；当前继续保留尺寸冻结与宽度锁定逻辑，避免页面图片在下载结果中丢失。
- 进一步修正 PNG 与页面预览不一致的问题：导出时除了冻结栏位容器，也会冻结图片元素自身当前实际渲染宽高与 `object-fit` / `object-position`，避免下载 PNG 时图片自动填满栏位。
- 针对 PNG 下载中“图片硬填满栏位”的问题，再次调整导出克隆逻辑：图片区块容器继续冻结尺寸，但图片元素本身改为 `auto + max-width/max-height` 约束，保留 `object-fit/object-position`，让下载结果更接近页面中的留白与构图。
- 修正 PNG 未保留页面两倍放大效果的问题：页面中已按规则放大的图片会带上导出标记，下载 PNG 时仅对这些图片冻结当前实际渲染尺寸，确保导出结果维持页面上的两倍显示效果，同时不影响普通图片的留白表现。
- 已回退“普通图片统一冻结实际宽高”的 PNG 导出改动，恢复为仅对页面内已放大的图片冻结当前实际尺寸；普通图片继续保留原本的 `auto + max-width/max-height` 表现，避免主图与立绘底部留白被破坏。
- 修正刷新时图片先小后大的问题：详情页在服务端预先读取角色图与图库图片的真实尺寸，首屏即可直接按最终放大规则渲染，不再依赖浏览器 `onLoad` 后再从小图跳成两倍显示。
- 修正部署构建报错：`getDoubleScaledImageStyle` 改为接收纯尺寸元数据，避免将缺少 `src` 的 `GalleryImageMeta` 传给 `CharacterDetailGalleryImage` 类型参数而导致 TypeScript 编译失败。
