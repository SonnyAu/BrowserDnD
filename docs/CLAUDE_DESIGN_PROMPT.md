# Prompt for Claude Design — BrowserDnD UI/UX Restyle

## Your mission

Reskin a working browser-based dungeon crawler called **BrowserDnD** into something that feels like a love letter to the *Dungeons & Dragons 5e Player's Handbook* and the menus of *The Elder Scrolls* (Morrowind/Oblivion/Skyrim). I want a player who opens this in a browser tab to feel a little chill go up their spine — like they just cracked open a leather-bound tome by candlelight in a stone keep.

You do **not** have access to the repo. Everything you need to know is in this prompt. Trust this description.

The deliverable is a **pure visual / UI restyle**. You may rewrite styling (Tailwind classes, CSS, SVG ornaments, fonts, textures, micro-animations, decorative wrappers) but you may **not**:

- Change the page layout / grid / panel positions / panel sizes.
- Change, remove, rename, or reorder any UI element, button, label, stat, slot, or text the player reads.
- Touch any gameplay logic, state, props, event handlers, keybindings, or the engine.
- Introduce new dependencies that bloat the bundle. Prefer pure CSS, inline SVG, and Google Fonts. No image assets unless you author them yourself as inline SVG/CSS.

Innovate **inside** the existing skeleton. Treat layout as immovable scripture. Treat aesthetics as a blank canvas.

## Tech stack you are designing inside

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (already wired up via `@import "tailwindcss"` in `app/globals.css`)
- All components are client components in `browserdnd/components/`.
- The single page is `app/page.tsx` which renders `<GameLayout />`.

You may add a `<link>` for Google Fonts in `app/layout.tsx` and add custom CSS / `@theme` tokens / keyframes / utility layers in `app/globals.css`. You may add inline SVG (filigree corners, divider flourishes, rune glyphs, heraldic crests, dragon sigils) directly inside components.

## The locked layout — DO NOT MOVE THESE

The root grid in `components/GameLayout.tsx` is non-negotiable:

```
grid-cols-[300px_1fr_350px]   // 3 columns: 300px | flex | 350px
grid-rows-[2fr_1fr]            // 2 rows: tall row | short row
h-screen w-screen p-2 gap-2
overflow-hidden                // no scrolling the page itself
```

Five children fill that grid in this exact order:

1. **CharacterPanel** — left column, **spans both rows** (`row-span-2`). Tall, narrow.
2. **EventLog** — middle column, top row (the wide top-middle).
3. **DungeonMap** — right column, top row.
4. **ActionMenu** — middle column, bottom row.
5. **FuturePanel** (a.k.a. inventory ledger) — right column, bottom row.

Visualized:

```
┌──────────┬───────────────────────┬─────────────┐
│          │                       │             │
│  CHAR    │     EVENT LOG         │   DUNGEON   │
│  PANEL   │  (Raven Dispatches)   │    MAP      │
│  (tall,  │                       │  (War Map)  │
│  spans   ├───────────────────────┼─────────────┤
│  both    │                       │             │
│  rows)   │    ACTION MENU        │  INVENTORY  │
│          │  (Council Commands)   │   LEDGER    │
└──────────┴───────────────────────┴─────────────┘
   300px            1fr                  350px
```

Every panel is currently a rounded rectangle with a thin warm-brown border, a dark gradient fill, and an interior soft shadow. You are replacing the *feel* of those rectangles, not their grid placement.

## Every panel, in detail (so you know exactly what you're styling)

### 1. CharacterPanel (`components/CharacterPanel.tsx`)
The left "tome page" / character sheet. Top-to-bottom contents:

- Character name heading: `Aldric` (uppercase, serif)
- Subtitle line: `Sworn Sword • Level 5`
- **Three stat bars**, each with label + `current/max` text + a horizontal bar:
  - `Vigor` (HP) — currently red
  - `Focus` (MP) — currently sky blue
  - `Renown` (XP) — currently amber
- A coin row: `🪙 342 Dragons`
- A two-stat row: `ATK 12   DEF 6`
- A horizontal divider
- An **Armory** sub-section (the `EquipmentGrid` component) — a 3×3 grid where only 5 cells are filled in a + cross pattern:

```
   [   ] [HELM] [   ]
   [SIDE] [CHST] [MAIN]
   [   ] [PNTS] [   ]
```

  Each filled cell is a 64×64 square button with an emoji icon (`🪖 🛡️ 🦺 ⚔️ 👖`) and, when equipped, a tiny gold item name underneath. The H3 above the grid says `Armory`.

### 2. EventLog (`components/EventLog.tsx`)
Header bar at the top of the panel: `Raven Dispatches`. Below that, a vertically scrolling stream of small message cards. Each message is a rounded-rect with a warm-brown border, dark fill, and a single line of beige text. Auto-scrolls to bottom on new message. Initial message: *"You cross the Narrow Sea. Use WASD or arrow keys to march."*

### 3. DungeonMap (`components/DungeonMap.tsx`)
Header: `War Map`. Body is a centered tile grid of small 24×24 squares with 2px gaps, each colored by tile type:

| Tile | Meaning | Current color |
|------|---------|---------------|
| `?` | Fog of war | near-black |
| `#` | Wall | warm dark brown |
| `.` | Floor | very dark brown |
| `P` | Player (gets a gold ring) | tan/gold |
| `E` | Enemy | dark red |
| `T` | Treasure | amber |
| `W` | Weapon | teal-blue |
| `N` | NPC | brown |
| `B` | Boss | deep red |
| `A` | Armor | mossy green |
| `K` | Key | mustard |
| `D` | Door | warm tan |
| `S` | Stairs | stone gray |

The player tile (`P`) has a 2px gold ring with a dark offset ring — keep that "you are here" highlight loud and obvious.

### 4. ActionMenu (`components/ActionMenu.tsx`)
A header that **changes by mode** (the heading and hint text already swap based on game state — preserve those exact strings):

- `default` → heading **Council Commands**, hint *"Available while traversing and scouting."*
- `dialogue` → heading **Court Audience**, hint *"Your responses change with who you address."*
- `combat` → heading **Battle Orders**, hint *"Orders shift as steel is drawn."*
- `loot` → heading **Spoils of War**, hint *"A relic lies before you."*

Below the header is a flex-wrap of large rectangular action buttons. Button labels per mode (do not rename these):

- default: `Explore`, `Inventory`, `Character`, `Rest`, `Interact`
- combat: `Attack`, `Defend`, `Skill`, `Item`, `Run`
- loot: `Pick Up`, `Leave`
- dialogue: `Talk`, `Trade`, `Leave`

### 5. FuturePanel (`components/FuturePanel.tsx`) — inventory ledger
Two visual states, both occupying the same bottom-right cell:

- **Closed state** (default): centered text `Small Council Ledger` with subtitle *"Tap Inventory to manage gear."*
- **Open state** (when player toggled inventory): heading `Inventory`, helper line *"Select item, then click an Armory slot to equip."*, then a vertical list of item buttons. Each item shows its name and `(type)`. Selected item gets a brighter gold border + filled background.

## The current visual baseline (what you are replacing)

So you know the starting point: dark `#0b0b0b` background with two soft red/gold radial-gradient glows; every panel is a `rounded-lg` with border `#3d2f23`, a 160°/165°/170° linear-gradient interior in the `#15100d → #1d1612` range, and a soft black drop shadow. Headings are uppercase serif with `tracking-[0.2em]` in muted gold `#d9b66f`. Body text is parchment beige `#e8d9b5`. Font is `Georgia, "Times New Roman", serif`.

It's competent. It's not awe-inspiring. Your job is awe.

## Aesthetic direction — D&D 5e × Elder Scrolls

Pull from these specific references, in priority order:

1. **D&D 5e Player's Handbook interior pages** — illuminated parchment, hand-drawn ink filigree borders, drop caps, sepia ink, gold leaf section dividers, heraldic chapter sigils, hand-ruled lines, marginalia.
2. **Skyrim's quest journal & inventory menus** — Nordic knotwork, riveted iron plates, weathered vellum, bone-white text on charcoal, ember/torch glow, restrained and high-contrast.
3. **Oblivion / Morrowind tomes** — gilded scroll work, wax seals, illuminated initials, quill-drawn diagrams.
4. **Baldur's Gate 3 character sheet** — modern, breathing, *alive* ornament without being kitsch. This is your taste compass for "innovative, not LARPy."

The North Star: it should look like **the in-game UI of a AAA cRPG that costs $70**, not a stock dashboard reskin.

### Concrete moves you should consider (innovate freely; this is a menu, not a checklist)

**Materials & textures**
- Layered parchment-on-leather feel: warm aged paper for content, dark tooled leather for chrome/borders, riveted iron or brass for hard edges.
- Subtle paper-grain noise via SVG `<filter>` `feTurbulence` (cheap, no assets).
- Vignette and burnt-edge gradients on parchment surfaces.
- Wax-seal accents (a single deep-red or imperial-blue circle with an embossed sigil) for status badges or the active mode indicator.

**Borders & frames**
- Replace plain `border-1` rectangles with **ornate corner flourishes** — inline SVG filigree at each corner of each panel, with a thin gold inner stroke and a thicker dark-leather outer stroke. The body of the border can stay rectangular but the corners must feel hand-drawn.
- Section dividers are not `<hr>` — they're a centered diamond/fleur ornament with hairlines extending to the panel edges.
- Embossed double-rule frames (light hairline + shadow) so panels feel pressed into leather, not floating.

**Typography**
- Body / UI: a refined humanist serif. **Cormorant Garamond** or **EB Garamond** (both Google Fonts) for body and labels.
- Headings: a display blackletter or rustic serif. **Cinzel** for SMALL CAPS section headers, or **IM Fell English SC** for a more inked, antique feel. Use Cinzel for short authoritative labels (`COUNCIL COMMANDS`), and the Fell family for atmospheric prose in the event log.
- Numerals on stat bars and the war map should be a slightly different weight or use **old-style figures** for character.
- Big drop-cap on the first line of the event log when only one message is showing — gold, illuminated, with a subtle red interior flourish.

**Color palette** (a starting point — refine it)
- Vellum: `#efe2c4` (only used inside parchment surfaces)
- Aged parchment: `#d9c79a`
- Ink / body text on parchment: `#2b1d10`
- Tooled leather: `#2a1a10` → `#1a0f08` gradient
- Deep oxblood (sigils, wax seals, HP): `#7a1f1f` with a `#c8423d` highlight
- Imperial gold (chrome, accents): `#c9a14a` with a brighter `#f1d27a` rim-light
- Patinated brass (rivets, slot edges): `#8a6a2a`
- Forest moss (XP/Renown? or NPC?): `#4a5a2c`
- Cobalt enamel (MP/Focus): `#2c4a7a` with a frosty `#7fa6d6` highlight
- Ember / candleglow: `#ff8a3d` (used sparingly as a glow on hover)

You may keep the existing dark backdrop *outside* the panels (the page body) and turn the panel **interiors** into parchment. The contrast — dark stone keep around glowing parchment pages — is the core aesthetic.

**Stat bars**
- Replace flat rounded bars with **engraved capsules**: a recessed iron channel containing a glowing fluid (HP = blood, MP = arcane mist, XP = molten gold). Add a tiny inner highlight line at the top of the fill so it reads as 3D liquid, not a flat rectangle.
- A faint pulse on HP when below 25%. Do not change the data — only the look.

**Equipment grid (Armory)**
- Each slot becomes an iron-bound parchment square with brass rivets at the corners. Empty slots show a faint engraved silhouette of what belongs there (a horned helm pictogram, a long-sword silhouette, a kite shield, breastplate, greaves) so an empty slot still looks designed. Filled slots glow gently and the emoji can be replaced with a refined inline SVG icon (or kept if simpler — but elevate it: monochrome and tinted gold).

**War Map**
- Wrap the tile grid in a **tooled-leather frame** with iron corner brackets and a central top cartouche reading `WAR MAP`. Add a faint hand-drawn cardinal compass (N/E/S/W) in one corner as decoration.
- Tiles keep their colors (gameplay-relevant) but each tile gains a 1px inner highlight + a 1px inner shadow so the grid reads as inlaid stone, not flat squares. Floors `.` should look like flagstones (very subtle noise). Walls `#` should look like rough-hewn stone. Fog `?` should be a dense ink wash. The player `P` keeps the gold ring but make it **pulse softly** as a candle would.

**Event log (Raven Dispatches)**
- Each message looks like a small parchment ribbon with torn/burnt edges (CSS `clip-path` or SVG mask). The newest message has a faint warm glow as if just delivered. A tiny raven-feather SVG sits to the left of each message as a bullet.

**Action menu buttons**
- Buttons become **iron banners**: dark leather face, gold trim, slight bevel. On hover: a torch-flicker warm glow + a single ember particle CSS animation, and the gold trim brightens. On active/press: a "stamped" inset.
- The mode header should read like a banner unfurled across the top of the panel — change the visual weight when mode changes, almost like the banner re-drapes. (Pure CSS transition is fine; no JS changes.)

**Inventory ledger (FuturePanel)**
- Closed state: a closed leather-bound ledger with a wax seal and the words `SMALL COUNCIL LEDGER` embossed on the cover. Tiny line beneath: `Tap Inventory to manage gear.`
- Open state: the same ledger, but visually "opened" — two-page-spread feel with a subtle center crease. List items render as inked entries on parchment, each with a tiny item-type sigil (sword, shield, vial, coin, key) hand-drawn in SVG. Selected item is highlighted with a quill-underline and a gilt border, not a generic background fill.

**Page chrome**
- The dark background outside panels should feel like the **interior of a stone keep**: deep charcoal with a very subtle tiled stone normal-map noise, two warm torchlight pools (top-left and top-right corners) that *very slowly* breathe (a 6–8s ease-in-out opacity loop). Existing radial gradients are the right idea — make them feel like real torchlight, not CSS glows.
- Add a faint, near-invisible ambient particle drift (dust motes) — pure CSS, 6–10 absolutely positioned divs, opacity ~5%, slow drift. Skip this if it harms perf or feels gimmicky in your judgment.

**Micro-interactions** (subtle, never goofy)
- Hover on any button: a 120ms ember-glow intensify + 1px translate-up. No bouncy springs.
- Stat bar value changes: a brief gold sheen sweeps across the bar (CSS `@keyframes` only, no JS).
- Mode header swap in ActionMenu: 200ms cross-fade so the banner re-drapes smoothly.
- Map player ring: 2.5s candle-pulse loop.
- Newest event-log message slides in from the right with a 180ms ease-out, simulating a raven arriving.

**Accessibility & polish** (do not skip)
- Maintain WCAG AA contrast. Parchment + dark ink should hit this naturally; verify gold-on-leather labels do too.
- Preserve all `title` attributes, semantic headings, and button affordances.
- Respect `prefers-reduced-motion` — disable the candle pulse, raven slide-in, ember glow, and torch breathing under that media query.
- Everything must remain crisp at 1280×720 and beautiful at 1920×1080 and up. The grid is fixed-pixel on the outer columns (300/350) — design assuming those widths.
- Zero scrollbars on `<body>`. Internal scroll inside EventLog and the inventory ledger is fine and should get a slim, themed scrollbar (gold thumb on dark track).

## Files you may edit

- `app/globals.css` — go heavy here. Add `@theme` tokens, custom properties, keyframes, utility classes, SVG filter defs.
- `app/layout.tsx` — only to add Google Fonts `<link>` tags and apply a font class to `<body>`.
- `components/GameLayout.tsx` — **only** the className strings on existing elements and the optional decorative overlay div. Do not change the grid template, the children order, or any prop passed to children.
- `components/CharacterPanel.tsx` — restyle freely; preserve every label, every stat, the StatBar component's API, and the EquipmentGrid placement.
- `components/EventLog.tsx` — restyle freely; preserve auto-scroll behavior and the message rendering.
- `components/DungeonMap.tsx` — restyle freely; **do not change the `tileStyles` keys** (the engine writes those tile chars). You can change the *colors* and add inner highlights/shadows, but keep them readable and visually distinct.
- `components/ActionMenu.tsx` — restyle freely; preserve `modeLabels` and `modeHints` text exactly, preserve button text exactly, preserve `onAction(action)` calls.
- `components/FuturePanel.tsx` — restyle freely; preserve both states, preserve item list semantics, preserve selection behavior.
- `components/EquipmentGrid.tsx` — restyle freely; preserve the 3×3 grid with the + cross pattern, preserve `onSlotClick(slot.name)`, preserve slot names.

## Files you must NOT edit

- Anything in `engine/` — that's pure gameplay logic.
- `components/data/mockData.ts` — labels, modes, slot names, button text. (You may suggest edits in a separate note if you really feel a label is wrong, but do not change them yourself.)
- `app/page.tsx`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `package.json` — leave alone unless you genuinely need a font dependency, in which case prefer Google Fonts via `<link>` and require zero npm changes.

## Deliverable

Produce the full updated files for everything you change. For each file, explain in 2–3 sentences what you did and why. End with a short "design rationale" section (max 200 words) describing the unifying concept — give it a name, like *"Codex of the Sworn Sword"* or whatever fits — so a future contributor can extend the system coherently.

If you invent any reusable visual primitives (e.g. an `<OrnateFrame>` SVG wrapper, an `<EmberButton>` component, a `<WaxSeal>` badge, a parchment background utility class), define them once and reuse them across panels. Consistency is half the magic.

## Final note on taste

I do not want a Renaissance Faire costume. I do not want stock medieval clipart. I do not want a generic dark-fantasy dashboard. I want the quiet, confident, hand-crafted feel of a *real* artifact — something that looks like a senior art director on a shipped RPG signed off on it. Restraint is more impressive than ornament. Every flourish must earn its place. When in doubt: fewer, better, more intentional.

Make me feel like I'm holding a tome.
