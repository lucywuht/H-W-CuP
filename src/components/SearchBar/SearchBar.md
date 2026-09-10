# SearchBar

**Import:** `import { SearchBar } from "./components/SearchBar"`
**Category:** components
**Intent:** Site-wide search bar

## Props

- `value`: string (required)
- `onChange`: (value: string) => void (required)
- `onClear`: () => void
- `onCancel`: () => void
- `placeholder`: string
- `disabled`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
