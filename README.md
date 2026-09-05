# 🌿 witch-basic-mcp

A Witch's Basic Tools — MCP server for everyday correspondences.

Query herbs, crystals, colors, moon phases, sabbats, planetary days, elements, and magical intents through natural tool calls.

## Tools

| Tool | What it does |
|------|--------------|
| `lookup_herb` | Search 409 Cunningham herbs + 900 Open Occult botanicals — correspondences, lore, Latin names, warnings |
| `lookup_crystal` | Search crystals by name → properties, element, hardness |
| `lookup_color` | Search magical color correspondences |
| `query_intent` | Input an intent (protection, love, prosperity…) → matching herbs, crystals, colors, timing |
| `today_guidance` | Based on current weekday + moon phase → what's aligned today |
| `next_sabbat` | Next Wheel of the Year holiday — date, theme, traditions, materials |
| `moon_phase_info` | Look up a specific moon phase's energy and correspondences |
| `element_info` | Look up an element's direction, tools, herbs, crystals |
| `moon_in_sign` | Moon in zodiac sign → aligned magical work, herbs, crystals, mood |
| `planet_retrograde` | Planet retrograde interpretation → what to do, avoid, herbs, crystals, witch tips |
| `lookup_recipe` | Search magical recipes by name, intent, or ingredient |
| `list_recipes` | List all available magical recipes |

## Data Sources

- **Cunningham's Encyclopedia** — 409 herbs with gender, planet, element, powers, lore, Latin names, magical uses (data/herbs.json)
- **Open Occult** (MIT) — ~900 botanicals, crystals, colors (data/vendor/)
- **Self-built** — moon phases, sabbats, planetary days, elements, intent cross-references, moon-in-signs, retrogrades, recipes

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
