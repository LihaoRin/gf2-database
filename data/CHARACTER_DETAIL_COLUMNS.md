# Character Detail Columns

`data/character-details.csv` 用来维护角色详情页文字内容。

## 字段说明

- `id`: 对应角色主表中的数字 ID
- `profile_title`: 详情页主标题
- `archive_code`: 档案编号
- `faction`: 阵营
- `role_label`: 定位 / 职能
- `illustrator`: 绘师
- `voice_actor`: 声优
- `height`: 身高
- `theme_color`: 主题色代码，例如 `#F08943`
- `birthplace`: 出身
- `combat_style`: 战斗方式
- `status_note`: 状态备注
- `overview`: 角色简介
- `weapon_name`: 武器名称
- `weapon_name_zh`: 武器中文名
- `weapon_name_en`: 武器英文名
- `weapon_image`: 武器图片路径，现可作为未建立 `武器` 文件夹时的兜底
- `weapon_description`: 武器说明
- `equipment_note`: 额外备注

## 当前建议填写字段

现在最常用、页面会直接显示的字段是：

- `profile_title`
- `voice_actor`
- `height`
- `theme_color`
- `overview`
- `weapon_name`
- `weapon_name_zh`
- `weapon_name_en`
- `weapon_description`
- `equipment_note`

## 使用方式

1. 编辑 `data/character-details.csv`
2. 执行 `npm run import:character-details`
3. 页面会读取 `data/character-details.json`

## 图片文件夹规则

角色详情图片现在优先从以下目录读取：

`public/images/details/<id>/`

例如 `1` 号角色：

`public/images/details/1/`

子文件夹显示顺序固定为：

1. `図鑑`
2. `Skin1`、`Skin2`、`Skin3`... 依数字顺序
3. `他の参考画像`
4. `武器`

规则说明：

- 只有子文件夹内实际存在图片时，页面才会显示该区块
- `図鑑` 与 `Skin` 区块会按文件名 `01` 到 `04` 的顺序，从左到右显示
- `図鑑` 的第一张图会作为左侧主展示图
- `武器` 文件夹中的第一张图会作为武器区主图
- 支持的图片格式：`.png`、`.jpg`、`.jpeg`、`.webp`、`.avif`
- 若没有建立某个 `Skin` 文件夹，对应区块不会显示

## 路径规则

- 角色主卡图片继续放在 `public/images/`
- 角色详情图片建议放在 `public/images/details/<id>/...`
- 若未建立详情图片文件夹，详情页左侧仍会先用角色主图兜底显示
