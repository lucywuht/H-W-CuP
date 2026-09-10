# PromotionalItemTile

**Import:** `import { PromotionalItemTile } from "./patterns/PromotionalItemTile"`
**Category:** patterns

## Props

- `image`: string (required)
- `name`: string (required) — The product name. Used as the image alt text so screen reader users know
- `price`: string (required)
- `cents`: string (required)
- `onAddToCart`: () => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void