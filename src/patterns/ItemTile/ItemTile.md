# ItemTile

**Import:** `import { ItemTile } from "./patterns/ItemTile"`
**Category:** patterns
**Intent:** Product tile for carousels (~200px max width)

## Props

- `image`: string (required)
- `name`: string (required)
- `price`: string (required)
- `cents`: string (required)
- `originalPrice`: string
- `pricePrefix`: string
- `priceSuffix`: string
- `badge`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance"; ... }
- `hearted`: boolean
- `onHeartChange`: (hearted: boolean) => void

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
