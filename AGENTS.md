# AGENTS.md

## 项目说明

这是一个最小可运行的 `Next.js + Tailwind CSS` 网站项目，用于展示《少女前线 2》角色列表，并支持中文、日文、英文名称搜索。

## 项目结构

```text
.
├─ app/
│  ├─ globals.css          # 全局样式与 Tailwind 入口
│  ├─ layout.tsx           # 根布局
│  └─ page.tsx             # 首页入口
├─ components/
│  ├─ CharacterCard.tsx    # 角色卡片
│  ├─ CharacterExplorer.tsx# 搜索状态与筛选逻辑
│  ├─ CharacterGrid.tsx    # 角色列表网格
│  └─ SearchBar.tsx        # 搜索框
├─ data/
│  └─ characters.json      # 角色数据源
├─ lib/
│  └─ types.ts             # TypeScript 类型定义
├─ public/
│  └─ images/
│     └─ placeholder-character.svg  # 占位图
├─ IMPLEMENTATION.md       # 功能实现记录，完成后必须更新
├─ next.config.ts          # Next.js 配置
├─ package.json            # 项目依赖与脚本
├─ postcss.config.js       # PostCSS 配置
├─ tailwind.config.ts      # Tailwind 配置
└─ tsconfig.json           # TypeScript 配置
```

## 开发流程

所有后续开发必须遵守以下流程：

1. 先进行 `plan`，明确目标、涉及文件、实现步骤、验证方式。
2. 在 `plan` 明确后再开始执行，不允许跳过规划直接改代码。
3. 执行过程中保持组件拆分清晰，避免把搜索、展示、数据处理全部堆到单一文件。
4. 每完成一个独立功能，必须同步更新 `IMPLEMENTATION.md`。
5. 修改完成后，必须给出可运行验证步骤，并尽量实际执行验证命令。

## 实作要求

- 数据应优先来自 `data/characters.json`
- 页面组件尽量保持单一职责
- 代码必须可运行，不能只提供示例片段
- 新增功能时，优先复用现有组件与类型定义
- 若有样式调整，优先在现有 Tailwind 结构上扩展

## 验证要求

每次功能完成后，至少提供以下验证信息：

1. 安装依赖命令
2. 本地开发启动命令
3. 构建命令
4. 如有交互功能，说明手动验证步骤

标准命令：

```bash
npm install
npm run dev
npm run build
```

## 当前已实现内容

- 已创建最小 `Next.js` 项目
- 已集成 `Tailwind CSS`
- 已实现首页搜索框
- 已实现角色卡片与角色网格
- 已接入 `characters.json` 数据源
- 已支持中文、日文、英文名称搜索

## 文档维护规则

- 新功能完成后，必须更新 `IMPLEMENTATION.md`
- 若项目结构变化，必须同步更新本文件的“项目结构”部分
- 若开发流程有调整，必须同步更新本文件的“开发流程”部分
