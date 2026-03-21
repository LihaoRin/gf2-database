# Character Columns

`data/characters.csv` 是角色表格主资料。

## 字段说明

- `id`: 角色数字 ID，建议连续编号
- `name_zh`: 中文名
- `name_ja`: 日文名
- `name_en`: 英文名
- `image`: 图片路径，可留空；留空时会自动使用 `/images/<id>.webp`

## 推荐维护方式

1. 先复制 `data/characters.template.csv`
2. 在 Excel 或 Google Sheets 中编辑
3. 导出为 UTF-8 CSV
4. 覆盖 `data/characters.csv`
5. 执行 `npm run import:characters`

## 图片规则

- 推荐把图片放在 `public/images/`
- 推荐图片文件名与数字 `id` 对应
- 若 `image` 留空，导入脚本会自动写成 `/images/<id>.webp`

例如：

```csv
6,索米,スオミ,Suomi,
```

会自动生成：

```json
{
  "id": 6,
  "image": "/images/6.webp"
}
```
