# 进度同步文档

最后更新: 2026-09-04

本文档用于跨窗口/跨实例同步项目状态。任何实例做了进展都应该更新这个文件。

---

## 项目概况

witch-basic-mcp 是一个 MCP 工具服务器，提供草药、水晶、颜色、月相、安息日、行星日、元素、意图对应关系的查询。

仓库: `ellllapie/witch-basic-mcp`
部署: Railway (stdio transport)

---

## 已完成

### 架构 (v0.1.0)
- [x] MCP server 骨架 (src/server.js)
- [x] Open Occult 数据拉取脚本 (scripts/fetch-data.js)
- [x] package.json + prestart hook

### 10 个工具
- [x] lookup_herb — 按名称模糊搜索草药
- [x] lookup_crystal — 按名称搜索水晶
- [x] lookup_color — 搜索颜色魔法对应
- [x] query_intent — 按意图查推荐 (herbs/crystals/colors/timing/candle)
- [x] today_guidance — 当日星期 + 月相综合建议
- [x] next_sabbat — 下一个安息日
- [x] moon_phase_info — 月相详情
- [x] element_info — 元素详情
- [x] moon_in_sign — 月亮过境星座的魔法对应
- [x] planet_retrograde — 行星逆行解读

### 自建数据文件
- [x] data/moon_phases.json — 8 月相
- [x] data/sabbats.json — 8 安息日
- [x] data/planetary_days.json — 7 行星日
- [x] data/elements.json — 5 元素
- [x] data/intents.json — 17 种意图
- [x] data/moon_in_signs.json — 12 星座月亮过境
- [x] data/retrogrades.json — 8 行星逆行

### Vendor 数据 (Open Occult, MIT)
- [x] data/vendor/botanicals.json — ~900 草药 (运行时拉取)
- [x] data/vendor/crystals.json — 水晶
- [x] data/vendor/colors.json — 颜色

### 自建草药数据 (Cunningham)
- [x] data/herbs.json — 约 60 条，手动从已有知识建的初版

---

## 待完成: 《魔药学》数据提取

### 来源
Scott Cunningham《Encyclopedia of Magical Herbs》中文版《魔药学：魔法、药草与巫术的神奇秘密》
OCR Word 版本已成功提取，质量良好。

### 目标
从书中提取全部 400+ 草药条目，扩充 data/herbs.json。

### 每条草药需要的字段
```json
{
  "HerbName": "英文名",
  "scientificName": "学名",
  "commonNames": ["别名1", "别名2"],
  "gender": "Masculine / Feminine",
  "planet": "对应行星",
  "element": "对应元素",
  "deities": ["对应神祇"],
  "powers": ["魔法用途1", "魔法用途2"],
  "ritualUses": "仪式用途（如有）",
  "magicalUses": "魔法用途描述（如有）",
  "folkNames": ["民间名称"]
}
```

### 当前进度
- [x] PDF 获取 (68MB 扫描版)
- [x] OCR 转 Word (WPS, 质量良好)
- [x] Word 内容成功读入上下文
- [x] 初版 herbs.json (~60 条，从已有知识手建)
- [ ] **从 OCR 文本提取完整 400+ 条目** ← 当前任务
- [ ] 与 Open Occult botanicals.json 去重/合并
- [ ] 验证数据完整性
- [ ] server.js 中 lookup_herb 同时搜索 herbs.json 和 vendor/botanicals.json (已实现，但 herbs.json 数据量不足)

### 工作方式
由于完整书本 OCR 文本很长（上下文消耗大），这个提取任务适合在官端（大上下文窗口）完成。
提取完成后 push 到仓库，其他窗口自动同步。

### 注意事项
- herbs.json 当前格式和 vendor/botanicals.json 格式不同。server.js 中 formatHerb() 用的是 vendor 格式的字段名 (HerbName, AlsoCalled 等)。herbs.json 用的是另一套字段名 (scientificName, commonNames 等)。
- **需要统一**: 要么让 herbs.json 匹配 vendor 格式，要么在 server.js 加载时做字段映射。当前 lookup_herb 只搜索 vendor/botanicals.json，不搜索 herbs.json。这是一个 bug。
- Cunningham 的书是参考书经典，数据高度标准化，每种草药都有固定的 gender/planet/element/powers 格式，适合批量提取。

---

## 已知问题

1. **herbs.json 未被 lookup_herb 使用** — server.js 只加载 vendor/botanicals.json 作为 herbs 数据源。data/herbs.json 存在但没接入查询。需要修改加载逻辑，合并两个数据源。
2. **README 未列出 moon_in_sign 和 planet_retrograde** — 实际有 10 个工具，README 只列了 8 个。

---

## 架构备注

- server.js 用 @modelcontextprotocol/sdk 的 McpServer + StdioServerTransport
- 所有数据在启动时一次性加载到内存
- 模糊匹配用简单的 includes()
- 月相计算用近似算法（基于 2000-01-06 新月），精确数据应配合 astral_moon_phase MCP
