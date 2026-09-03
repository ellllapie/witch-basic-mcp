# 🌿 witch-basic-mcp

A Witch's Basic Tools — MCP server for everyday correspondences.

Query herbs, crystals, colors, moon phases, sabbats, planetary days, and magical intents through natural tool calls.

## Tools

| Tool | What it does |
|------|--------------|
| `lookup_herb` | Search herbs by name → correspondences (planet, element, deities, warnings) |
| `lookup_crystal` | Search crystals by name → properties, element, hardness |
| `lookup_color` | Search magical color correspondences |
| `query_intent` | Input an intent (protection, love, prosperity…) → matching herbs, crystals, colors, timing |
| `today_guidance` | Based on current weekday + moon phase → what's aligned today |
| `next_sabbat` | Next Wheel of the Year holiday — date, theme, traditions, materials |
| `moon_phase_info` | Look up a specific moon phase's energy and correspondences |
| `element_info` | Look up an element's direction, tools, herbs, crystals |

## Data Sources

- **Open Occult** (MIT) — herbs, crystals, colors
- **Self-built** — moon phases, sabbats, planetary days, elements, intent cross-references

## Setup

```bash
npm install
npm run setup   # fetches Open Occult data into data/vendor/
npm start       # starts the MCP server (stdio transport)
```

## Deploy (Railway)

The `prestart` hook auto-fetches vendor data before starting.

## License

MIT
