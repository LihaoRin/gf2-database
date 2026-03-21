# DEPLOYMENT.md

## 推荐发布方式

当前项目推荐发布到 `Vercel`。

原因：

- 项目是 `Next.js App Router`
- 角色详情页会在伺服器端读取：
  - `data/characters.json`
  - `data/character-details.json`
  - `public/images/details/...`
- 不适合只放到纯静态空间

## 发布前检查

先确认本地资料已经同步：

```bash
npm install
npm run import:characters
npm run import:character-details
```

如果你只更新了其中一张表，就只跑对应的 import。

## GitHub 发布流程

1. 初始化 git（如果还没做）

```bash
git init
git add .
git commit -m "Initial deploy"
```

2. 在 GitHub 建立新仓库

3. 关联远端并推送

```bash
git remote add origin <你的仓库地址>
git branch -M main
git push -u origin main
```

## Vercel 发布流程

1. 登录 [Vercel](https://vercel.com/)
2. 选择 `Add New Project`
3. 导入你的 GitHub 仓库
4. Framework Preset 选择 `Next.js`
5. 保持默认 Build Command：

```bash
npm run build
```

6. 点击 `Deploy`

## 重新发布

以后你每次更新资料或页面，只要：

```bash
git add .
git commit -m "update"
git push
```

Vercel 就会自动重新部署。

## 自定义域名

部署完成后，可在 Vercel 项目后台：

`Settings -> Domains`

绑定你自己的域名。

## 注意事项

- `snapshots/` 已加入 `.gitignore`，不要推上远端
- `node_modules/` 不要推上远端
- 发布前记得先重新执行 CSV 转 JSON 的 import
