# BrowserDnD — Game Plan

## Current State
- **Working:** Player movement (WASD/arrows), dungeon map rendering, fog of war, tile-based item pickup/enemy detection, event log, UI layout, context-driven action menu, real player state, item pickup into inventory
- **Remaining:** Combat system, inventory/equip UI, NPC dialogue

---

## ✅ Phase 1 — Context-Driven Action Menu (DONE)
- Replaced keyword-based `deriveActionMode` with event/tile-driven mode
- Added `"loot"` as a new `ActionMode`
- `ActionMenu` accepts `onAction: (action: string) => void` — buttons are wired
- Movement locks when mode is not `"default"`
- Pick Up adds item to inventory; Leave dismisses

**ActionMode mapping:**
```
enemyEncounter  → "combat"    → [Attack, Defend, Skill, Item, Run]
itemPickup      → "loot"      → [Pick Up, Leave]
npcInteract     → "dialogue"  → [Talk, Trade, Leave]
default         → "default"   → [Explore, Inventory, Character, Rest, Interact]
```

All modes follow the same pattern: movement locks, menu reflects state, player resolves to return to `"default"`.

---

## ✅ Phase 2 — Real Player State (DONE)
- `initialPlayerState` in `mockData.ts` is source of truth
- `CharacterPanel` and `EquipmentGrid` accept `player` / `equipment` props
- `PlayerState` includes `attack`, `defense`, `inventory[]`, `equipment{}`
- ATK/DEF stats displayed in CharacterPanel
- Picked-up items land in `player.inventory[]`

```ts
PlayerState {
  name, level, xp, gold,
  hp, maxHp, mp, maxMp,
  attack, defense,
  inventory: ItemData[],
  equipment: { helmet, chest, mainWeapon, sideWeapon, pants }
}
```

---

## Phase 3 — Inventory & Equipment
**Blocked by: none (Phase 2 done)**

- Inventory panel toggle from "Inventory" button in default menu
- `EquipmentGrid` slots clickable — equip item from inventory
- Equipping recalculates `player.attack` / `player.defense`

---

## Phase 4 — Combat System
**Blocked by: none (Phase 2 done)**

New file `engine/combat.ts`:
```ts
interface Enemy { name, hp, maxHp, attack, defense }
interface CombatState { enemy: Enemy, active: boolean, playerTurn: boolean }
```

- On `enemyEncounter`: initialize `CombatState`, lock movement
- **Attack** → `Math.max(1, player.attack - enemy.defense)` dmg, then enemy counterattacks
- **Defend** → reduce incoming dmg this turn
- **Item** → use consumable from inventory
- **Run** → 50% flee chance, restore movement
- **Skill** → stub for stretch goal
- Enemy death: remove `E` tile, possibly drop item, return to default mode
- Player death: game over state + restart option

---

## Phase 5 — NPC Dialogue
**Blocked by: none (Phase 1 done)**

Walk into `N` tile → movement locks → menu switches to `"dialogue"` with that NPC's options.

- Add `N` to `EntityTile` type, place NPC(s) in sample map
- Walking into `N` → lock movement, load NPC dialogue state
- Dialogue options as buttons → responses fed into event log
- Player chooses response → next dialogue node loads
- Leave → movement unlocked, return to `"default"`
- **Content scoped separately** — system wired first, then hardcode 1-2 NPCs with real branching trees

---

## Dependency Graph
```
Phase 1 ✅  Phase 2 ✅
               │
        ┌──────┴──────┐
   Phase 3         Phase 4
 (Inventory)      (Combat)
        
Phase 5 (NPC) — unblocked, independent
```

---

## File Ownership

| File | Phase | Status |
|---|---|---|
| `engine/types.ts` | 1,2 | Done — `PlayerState`, `Equipment`, `ItemData.id`, `npcInteract` event |
| `engine/items.ts` | 2 | Done — updated to `Omit<ItemData, "id">` |
| `engine/combat.ts` | 4 | Not started |
| `engine/dungeonEngine.ts` | 5 | Not started — add NPC to map |
| `components/GameLayout.tsx` | 1,2 | Done — real state, event-driven mode, action handlers |
| `components/ActionMenu.tsx` | 1 | Done — `onAction` prop, loot mode |
| `components/CharacterPanel.tsx` | 2 | Done — accepts `player` prop |
| `components/EquipmentGrid.tsx` | 2,3 | Partial — shows equipment, equip logic pending |
| `components/data/mockData.ts` | 2 | Done — `initialPlayerState`, stripped mock character |
