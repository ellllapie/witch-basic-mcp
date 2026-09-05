# 进度同步文档

最后更新: 2026-09-05

本文档用于跨窗口/跨实例同步项目状态。任何实例做了进展都应该更新这个文件。

---

## 项目概况

witch-basic-mcp 是一个 MCP 工具服务器，提供草药、水晶、颜色、月相、安息日、行星日、元素、意图对应关系的查询。

仓库: `ellllapie/witch-basic-mcp`
部署: Railway (stdio transport)
版本: v0.4.0

---

## 已完成

### 架构 (v0.1.0 → v0.4.0)
- [x] MCP server 骨架 (src/server.js)
- [x] Open Occult 数据拉取脚本 (scripts/fetch-data.js)
- [x] package.json + prestart hook

### 12 个工具
- [x] lookup_herb — 搜索 Cunningham (409) + Open Occult (~900) 两个数据源，支持英文名/中文名/拉丁名/别名搜索
- [x] lookup_crystal — 按名称搜索水晶
- [x] lookup_color — 搜索颜色魔法对应
- [x] query_intent — 按意图查推荐 (herbs/crystals/colors/timing/candle)
- [x] today_guidance — 当日星期 + 月相综合建议
- [x] next_sabbat — 下一个安息日
- [x] moon_phase_info — 月相详情
- [x] element_info — 元素详情
- [x] moon_in_sign — 月亮过境星座的魔法对应
- [x] planet_retrograde — 行星逆行解读
- [x] lookup_recipe — 按名称/意图/材料搜索配方
- [x] list_recipes — 列出所有配方

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

### Cunningham 草药数据 ✅ 已完成
- [x] data/herbs.json — **409 条草药**，从《魔药学》OCR 文档提取
- [x] 所有字段 100% 覆盖: scientificName, nameZh, gender, planet, element, powers, magicalUses, lore
- [x] lore (文化/历史小故事) 逐条撰写，关键条目经过网络查证
- [x] 49 种标记为有毒
- [x] powers 全部翻译为英文
- [x] **server.js 已接入**: lookup_herb 同时搜索 herbs.json 和 vendor/botanicals.json

---

## 已修复的问题

1. ~~**herbs.json 未被 lookup_herb 使用**~~ → v0.4.0 已修复，lookup_herb 同时搜索两个数据源
2. ~~**README 未列出所有工具**~~ → 已更新，列出全部 12 个工具
3. ~~**herbs.json 数据量不足**~~ → 已从 60 条扩充到 409 条

---

## 待完成

- [ ] 与 Open Occult botanicals.json 交叉去重（当前两个数据源有重叠，同一草药可能返回两条结果）
- [ ] 水晶数据扩充（类似草药的深度数据）
- [ ] recipes.json 配方库扩充
- [ ] 部署测试

---

## 架构备注

- server.js 用 @modelcontextprotocol/sdk 的 McpServer + StdioServerTransport
- 所有数据在启动时一次性加载到内存
- 模糊匹配用简单的 includes()
- 月相计算用近似算法（基于 2000-01-06 新月），精确数据应配合 astral_moon_phase MCP
- herbs.json (Cunningham) 字段: nameZh, scientificName, folkNames, gender, planet, element, deities, powers, toxic, ritualUses, magicalUses, lore
- vendor/botanicals.json (Open Occult) 字段: HerbName, AlsoCalled, Description, Gender, Planet, Element, Sign, Deities, Family, Genus, Species, Warning
