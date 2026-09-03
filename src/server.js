import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'data');
const VENDOR = join(DATA, 'vendor');

// ─── Load data ───────────────────────────────────────────

function loadJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

let herbs = [];
let crystals = [];
let colors = [];
let moonPhases = [];
let sabbats = [];
let planetaryDays = [];
let elements = [];
let intents = {};
let moonInSigns = [];
let retrogrades = {};

try { herbs = loadJSON(join(VENDOR, 'botanicals.json')); } catch { console.warn('⚠ botanicals.json not found — run npm run setup'); }
try { crystals = loadJSON(join(VENDOR, 'crystals.json')); } catch { console.warn('⚠ crystals.json not found — run npm run setup'); }
try { colors = loadJSON(join(VENDOR, 'colors.json')); } catch { console.warn('⚠ colors.json not found — run npm run setup'); }
moonPhases = loadJSON(join(DATA, 'moon_phases.json'));
sabbats = loadJSON(join(DATA, 'sabbats.json'));
planetaryDays = loadJSON(join(DATA, 'planetary_days.json'));
elements = loadJSON(join(DATA, 'elements.json'));
intents = loadJSON(join(DATA, 'intents.json'));
moonInSigns = loadJSON(join(DATA, 'moon_in_signs.json'));
retrogrades = loadJSON(join(DATA, 'retrogrades.json'));

// ─── Helpers ─────────────────────────────────────────────

function fuzzyMatch(haystack, needle) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function formatHerb(h) {
  const lines = [`🌿 ${h.HerbName}`];
  if (h.AlsoCalled) lines.push(`  Also called: ${h.AlsoCalled}`);
  if (h.Description) lines.push(`  ${h.Description}`);
  lines.push(`  Gender: ${h.Gender || '—'}  |  Planet: ${h.Planet || '—'}  |  Element: ${h.Element || '—'}`);
  if (h.Sign) lines.push(`  Zodiac: ${h.Sign}`);
  if (h.Deities) lines.push(`  Deities: ${h.Deities}`);
  if (h.Family) lines.push(`  Family: ${h.Family} / ${h.Genus || ''} ${h.Species || ''}`.trim());
  if (h.Warning) lines.push(`  ⚠️ WARNING: ${h.Warning}`);
  return lines.join('\n');
}

function formatCrystal(c) {
  const lines = [`💎 ${c.crystalName}`];
  if (c.properties) lines.push(`  ${c.properties}`);
  lines.push(`  Attribute: ${c.attribute || '—'}  |  Element: ${c.element || '—'}`);
  if (c.color) lines.push(`  Color: ${c.color}`);
  if (c.mohs) lines.push(`  Mohs hardness: ${c.mohs}`);
  if (c.other) lines.push(`  Notes: ${c.other}`);
  return lines.join('\n');
}

function formatColor(c) {
  const lines = [`🎨 ${c.name}`];
  if (c.description) lines.push(`  ${c.description}`);
  lines.push(`  Element: ${c.element || '—'}  |  Direction: ${c.direction || '—'}  |  Planet: ${c.planet || '—'}`);
  if (c.day) lines.push(`  Day: ${c.day}`);
  if (c.plant) lines.push(`  Plants: ${c.plant}`);
  if (c.tarot) lines.push(`  Tarot: ${c.tarot}`);
  return lines.join('\n');
}

function formatMoonPhase(p) {
  const lines = [`${p.emoji} ${p.phase}`];
  lines.push(`  Energy: ${p.energy}`);
  lines.push(`  Good for: ${p.magick.join(', ')}`);
  lines.push(`  Herbs: ${p.herbs.join(', ')}`);
  lines.push(`  Crystals: ${p.crystals.join(', ')}`);
  lines.push(`  Element: ${p.element}`);
  if (p.deities?.length) lines.push(`  Deities: ${p.deities.join(', ')}`);
  return lines.join('\n');
}

function formatSabbat(s) {
  const lines = [`🎉 ${s.name} (${s.pronunciation})`];
  lines.push(`  Date: ${s.date}`);
  lines.push(`  Theme: ${s.theme}`);
  lines.push(`  ${s.description}`);
  lines.push(`  Colors: ${s.colors.join(', ')}`);
  lines.push(`  Herbs: ${s.herbs.join(', ')}`);
  lines.push(`  Crystals: ${s.crystals.join(', ')}`);
  lines.push(`  Traditions: ${s.traditions.join(', ')}`);
  lines.push(`  Foods: ${s.foods.join(', ')}`);
  return lines.join('\n');
}

function formatPlanetaryDay(d) {
  const lines = [`${d.symbol} ${d.day} — ${d.planet}`];
  lines.push(`  Energy: ${d.energy}`);
  lines.push(`  Good for: ${d.magick.join(', ')}`);
  lines.push(`  Colors: ${d.colors.join(', ')}`);
  lines.push(`  Herbs: ${d.herbs.join(', ')}`);
  lines.push(`  Crystals: ${d.crystals.join(', ')}`);
  lines.push(`  Metal: ${d.metal}  |  Element: ${d.element}`);
  return lines.join('\n');
}

function formatElement(e) {
  const lines = [`${e.symbol} ${e.element}`];
  lines.push(`  Direction: ${e.direction}  |  Season: ${e.season}  |  Time: ${e.timeOfDay}`);
  lines.push(`  Qualities: ${e.qualities.join(', ')}`);
  lines.push(`  Colors: ${e.colors.join(', ')}`);
  lines.push(`  Tools: ${e.tools.join(', ')}`);
  lines.push(`  Herbs: ${e.herbs.join(', ')}`);
  lines.push(`  Crystals: ${e.crystals.join(', ')}`);
  if (e.zodiac?.length) lines.push(`  Zodiac: ${e.zodiac.join(', ')}`);
  lines.push(`  Body aspect: ${e.bodyAspect}`);
  return lines.join('\n');
}

function formatIntent(name, data) {
  const lines = [`✨ Intent: ${name}`];
  lines.push(`  Herbs: ${data.herbs.join(', ')}`);
  lines.push(`  Crystals: ${data.crystals.join(', ')}`);
  lines.push(`  Colors: ${data.colors.join(', ')}`);
  lines.push(`  Element: ${data.element}  |  Best day: ${data.bestDay}`);
  lines.push(`  Best moon phase: ${data.bestMoonPhase}`);
  lines.push(`  Candle: ${data.candle}`);
  return lines.join('\n');
}

function formatMoonInSign(m) {
  const lines = [`${m.symbol} Moon in ${m.sign}`];
  lines.push(`  Element: ${m.element}`);
  lines.push(`  Energy: ${m.energy}`);
  lines.push(`  Good for: ${m.goodFor.join(', ')}`);
  if (m.avoidOrBeCareful?.length) lines.push(`  Be careful with: ${m.avoidOrBeCareful.join(', ')}`);
  lines.push(`  Herbs: ${m.herbs.join(', ')}`);
  lines.push(`  Crystals: ${m.crystals.join(', ')}`);
  lines.push(`  Body focus: ${m.bodyFocus}`);
  lines.push(`  Mood: ${m.mood}`);
  return lines.join('\n');
}

function formatRetrograde(planet, data) {
  const lines = [`${data.symbol} ${planet} Retrograde`];
  lines.push(`  Direct energy: ${data.directEnergy}`);
  lines.push(`  Retrograde energy: ${data.retrogradeEnergy}`);
  lines.push(`  Frequency: ${data.frequency}`);
  lines.push(`  Good for: ${data.goodFor.join(', ')}`);
  lines.push(`  Avoid: ${data.avoid.join(', ')}`);
  lines.push(`  Herbs: ${data.herbs.join(', ')}`);
  lines.push(`  Crystals: ${data.crystals.join(', ')}`);
  lines.push(`  Candle: ${data.candle}`);
  lines.push(`  🔮 ${data.witchTip}`);
  return lines.join('\n');
}

// ─── Sabbat date helpers ─────────────────────────────────

const SABBAT_APPROX_DATES = [
  { name: 'Imbolc',              month: 2,  day: 1 },
  { name: 'Ostara',              month: 3,  day: 20 },
  { name: 'Beltane',             month: 5,  day: 1 },
  { name: 'Litha',               month: 6,  day: 21 },
  { name: 'Lammas / Lughnasadh', month: 8,  day: 1 },
  { name: 'Mabon',               month: 9,  day: 22 },
  { name: 'Samhain',             month: 10, day: 31 },
  { name: 'Yule',                month: 12, day: 21 },
];

function getNextSabbat(now) {
  const year = now.getFullYear();
  for (const s of SABBAT_APPROX_DATES) {
    const d = new Date(year, s.month - 1, s.day);
    if (d > now) return { ...s, date: d };
  }
  // wrap to next year
  const s = SABBAT_APPROX_DATES[0];
  return { ...s, date: new Date(year + 1, s.month - 1, s.day) };
}

// ─── Simple moon phase calculation ──────────────────────
// Approximation based on the known new moon of Jan 6 2000

function getMoonPhaseIndex(date) {
  const LUNAR_CYCLE = 29.53059;
  const KNOWN_NEW_MOON = new Date(2000, 0, 6, 18, 14); // Jan 6, 2000 18:14 UTC
  const diffDays = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const age = ((diffDays % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  // 8 phases, each ~3.69 days
  return Math.floor(age / (LUNAR_CYCLE / 8));
}

function getCurrentMoonPhase(date) {
  const idx = getMoonPhaseIndex(date || new Date());
  return moonPhases[idx] || moonPhases[0];
}

// ─── MCP Server ──────────────────────────────────────────

const server = new McpServer({
  name: 'witch-basic',
  version: '0.2.0',
});

// 1. lookup_herb
server.tool(
  'lookup_herb',
  'Search herbs/botanicals by name. Returns magical correspondences, warnings, and botanical info.',
  { query: z.string().describe('Herb name or partial name to search') },
  async ({ query }) => {
    const results = herbs.filter(h =>
      fuzzyMatch(h.HerbName, query) ||
      (h.AlsoCalled && fuzzyMatch(h.AlsoCalled, query))
    );
    if (!results.length) return { content: [{ type: 'text', text: `No herbs found matching "${query}".` }] };
    return { content: [{ type: 'text', text: results.map(formatHerb).join('\n\n') }] };
  }
);

// 2. lookup_crystal
server.tool(
  'lookup_crystal',
  'Search crystals by name. Returns magical properties, element, Mohs hardness.',
  { query: z.string().describe('Crystal name or partial name') },
  async ({ query }) => {
    const results = crystals.filter(c => fuzzyMatch(c.crystalName, query));
    if (!results.length) return { content: [{ type: 'text', text: `No crystals found matching "${query}".` }] };
    return { content: [{ type: 'text', text: results.map(formatCrystal).join('\n\n') }] };
  }
);

// 3. lookup_color
server.tool(
  'lookup_color',
  'Search magical color correspondences — element, direction, planet, day, associated plants, tarot.',
  { query: z.string().describe('Color name') },
  async ({ query }) => {
    const results = colors.filter(c => fuzzyMatch(c.name, query));
    if (!results.length) return { content: [{ type: 'text', text: `No color found matching "${query}".` }] };
    return { content: [{ type: 'text', text: results.map(formatColor).join('\n\n') }] };
  }
);

// 4. query_intent
server.tool(
  'query_intent',
  'Input a magical intent (protection, love, prosperity, healing, divination, courage, peace, creativity, luck, banishing, wisdom, grounding, beauty, success, sleep, fertility, communication) and get matching herbs, crystals, colors, timing, and candle recommendations.',
  { intent: z.string().describe('Magical intent keyword') },
  async ({ intent }) => {
    const key = intent.toLowerCase().trim();
    if (intents[key]) {
      return { content: [{ type: 'text', text: formatIntent(key, intents[key]) }] };
    }
    const matches = Object.entries(intents).filter(([k]) => k.includes(key) || key.includes(k));
    if (matches.length) {
      return { content: [{ type: 'text', text: matches.map(([k, v]) => formatIntent(k, v)).join('\n\n') }] };
    }
    const available = Object.keys(intents).join(', ');
    return { content: [{ type: 'text', text: `No intent found matching "${intent}". Available: ${available}` }] };
  }
);

// 5. today_guidance
server.tool(
  'today_guidance',
  'Get magical guidance for today based on current weekday and moon phase.',
  {},
  async () => {
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[now.getDay()];
    const day = planetaryDays.find(d => d.day === dayName);
    const moon = getCurrentMoonPhase(now);

    const lines = [
      `📅 Today: ${dayName}, ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      '',
      formatPlanetaryDay(day),
      '',
      '── Current Moon Phase ──',
      formatMoonPhase(moon),
      '',
      '── Combined Guidance ──',
      `Today is ${dayName} (${day.planet}), with ${moon.phase} energy.`,
      `Aligned work: ${[...new Set([...day.magick.slice(0, 3), ...moon.magick.slice(0, 3)])].join(', ')}`,
      `Suggested herbs: ${[...new Set([...day.herbs.slice(0, 2), ...moon.herbs.slice(0, 2)])].join(', ')}`,
      `Suggested crystals: ${[...new Set([...day.crystals.slice(0, 2), ...moon.crystals.slice(0, 2)])].join(', ')}`,
      '',
      '💡 For precise moon sign and planetary positions, pair with astral_moon_phase / astral_current_transits.'
    ];
    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);

// 6. next_sabbat
server.tool(
  'next_sabbat',
  'Find the next Wheel of the Year sabbat — date, theme, traditions, correspondences.',
  {},
  async () => {
    const now = new Date();
    const next = getNextSabbat(now);
    const sabbat = sabbats.find(s => s.name === next.name || s.name.includes(next.name));
    if (!sabbat) return { content: [{ type: 'text', text: 'Could not determine next sabbat.' }] };
    const daysUntil = Math.ceil((next.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const text = formatSabbat(sabbat) + `\n\n  📆 ${daysUntil} days from today`;
    return { content: [{ type: 'text', text }] };
  }
);

// 7. moon_phase_info
server.tool(
  'moon_phase_info',
  'Look up a specific moon phase or get the current one. Phases: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent.',
  { phase: z.string().optional().describe('Moon phase name (omit for current)') },
  async ({ phase }) => {
    if (!phase) {
      const current = getCurrentMoonPhase(new Date());
      return { content: [{ type: 'text', text: '(Current phase)\n' + formatMoonPhase(current) }] };
    }
    const result = moonPhases.find(p => fuzzyMatch(p.phase, phase));
    if (!result) {
      const available = moonPhases.map(p => p.phase).join(', ');
      return { content: [{ type: 'text', text: `Phase not found. Available: ${available}` }] };
    }
    return { content: [{ type: 'text', text: formatMoonPhase(result) }] };
  }
);

// 8. element_info
server.tool(
  'element_info',
  'Look up a classical element: Fire, Water, Earth, Air, Spirit.',
  { element: z.string().describe('Element name') },
  async ({ element }) => {
    const result = elements.find(e => fuzzyMatch(e.element, element));
    if (!result) {
      const available = elements.map(e => e.element).join(', ');
      return { content: [{ type: 'text', text: `Element not found. Available: ${available}` }] };
    }
    return { content: [{ type: 'text', text: formatElement(result) }] };
  }
);

// 9. moon_in_sign
server.tool(
  'moon_in_sign',
  'Look up what magical work is aligned when the Moon is in a given zodiac sign. Get the sign from astral_moon_phase, then use this to know what to do with it. Covers all 12 signs.',
  { sign: z.string().describe('Zodiac sign name (e.g. Pisces, Aries, Scorpio)') },
  async ({ sign }) => {
    const result = moonInSigns.find(m => fuzzyMatch(m.sign, sign));
    if (!result) {
      const available = moonInSigns.map(m => m.sign).join(', ');
      return { content: [{ type: 'text', text: `Sign not found. Available: ${available}` }] };
    }
    return { content: [{ type: 'text', text: formatMoonInSign(result) }] };
  }
);

// 10. planet_retrograde
server.tool(
  'planet_retrograde',
  'Look up what a planet\'s retrograde means for magical practice — what to do, what to avoid, herbs, crystals, and witch tips. Get current retrograde status from astral_current_transits, then use this to interpret it. Covers Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.',
  { planet: z.string().describe('Planet name (e.g. Mercury, Saturn, Venus)') },
  async ({ planet }) => {
    const key = Object.keys(retrogrades).find(k => fuzzyMatch(k, planet));
    if (!key) {
      const available = Object.keys(retrogrades).join(', ');
      return { content: [{ type: 'text', text: `Planet not found. Available: ${available}` }] };
    }
    return { content: [{ type: 'text', text: formatRetrograde(key, retrogrades[key]) }] };
  }
);

// ─── Start ───────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
