# SearchResults

**Import:** `import { SearchResults } from "./patterns/SearchResults"`
**Category:** patterns

## Props

- `query`: string (required) — Active query string, shown in the header pill.
- `filters`: readonly string[] (required) — Filter chip labels rendered into the filter bar.
- `products`: readonly SearchResultProduct[] (required) — Products to render in the result list/grid.
- `layout`: "list" | "grid" — Layout — list (default) or grid.
- `onAddToCart`: (product: SearchResultProduct, index: number) => void — Called when a result's Add to cart is clicked.