# FlashDealsItemTile

**Import:** `import { FlashDealsItemTile } from "./patterns/FlashDealsItemTile"`
**Category:** patterns

## Props

- `image`: string (required)
- `name`: string (required)
- `price`: string (required)
- `cents`: string (required)
- `originalPrice`: string
- `pricePrefix`: string
- `badge`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance"; ... }
- `optionsText`: string
- `actionType`: "add" | "options" (required)
- `idx`: number (required)
- `onAddToCart`: () => void
- `hearted`: boolean
- `onHeartChange`: (hearted: boolean) => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void