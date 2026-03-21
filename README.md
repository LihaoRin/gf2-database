# GF2 Wiki Character Search

一个最小可运行的 `Next.js + Tailwind CSS` 项目，用于展示《少女前线 2》角色卡片，并支持中文、日文、英文名称搜索。

## 功能

- 首页顶部搜索框
- 下方角色卡片列表
- 卡片只显示角色图片和名字
- 数据来自 `data/characters.json`
- 支持中文、日文、英文搜索

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS

## 项目结构

```text
.
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ CharacterCard.tsx
│  ├─ CharacterExplorer.tsx
│  ├─ CharacterGrid.tsx
│  └─ SearchBar.tsx
├─ data/
│  └─ characters.json
├─ lib/
│  └─ types.ts
├─ public/
│  └─ images/
│     └─ placeholder-character.svg
├─ AGENTS.md
├─ IMPLEMENTATION.md
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
```

## 安装

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

启动后访问：

```text
http://localhost:3000
```

## 生产构建

```bash
npm run build
npm run start
```

## 数据格式

角色数据位于 [data/characters.json](/D:/gf2-wiki/data/characters.json)。

示例结构：

```json
[
  {
    "id": "groza",
    "image": "/images/placeholder-character.svg",
    "name": {
      "zh": "格罗扎",
      "ja": "グローザ",
      "en": "Groza"
    }
  }
]
```

字段说明：

- `id`：角色唯一标识
- `image`：角色图片路径，建议放在 `public/images/`
- `name.zh`：中文名
- `name.ja`：日文名
- `name.en`：英文名

## 搜索逻辑

- 搜索框位于页面顶部
- 输入内容后，会同时匹配 `zh`、`ja`、`en`
- 匹配规则为不区分英文大小写的包含搜索

## 组件说明

- [components/SearchBar.tsx](/D:/gf2-wiki/components/SearchBar.tsx)：输入框组件
- [components/CharacterCard.tsx](/D:/gf2-wiki/components/CharacterCard.tsx)：单个角色卡片
- [components/CharacterGrid.tsx](/D:/gf2-wiki/components/CharacterGrid.tsx)：角色网格布局
- [components/CharacterExplorer.tsx](/D:/gf2-wiki/components/CharacterExplorer.tsx)：搜索状态与筛选逻辑

## 验证步骤

1. 执行 `npm install`
2. 执行 `npm run dev`
3. 打开 `http://localhost:3000`
4. 确认页面顶部有搜索框
5. 确认页面下方有角色卡片列表
6. 输入中文名称，例如 `格罗扎`
7. 输入日文名称，例如 `ネメシス`
8. 输入英文名称，例如 `Suomi`
9. 输入不存在的关键字，确认显示空状态
10. 执行 `npm run build`，确认构建成功

## 当前验证结果

已验证：

- `npm install`
- `npm run build`

结果：

- 依赖安装成功
- 生产构建成功

## 协作规范

请先阅读：

- [AGENTS.md](/D:/gf2-wiki/AGENTS.md)
- [IMPLEMENTATION.md](/D:/gf2-wiki/IMPLEMENTATION.md)

约束重点：

- 开发前必须先 `plan`
- 每完成一个功能后必须更新 `IMPLEMENTATION.md`
- 所有提交内容必须可运行，并附带验证步骤
