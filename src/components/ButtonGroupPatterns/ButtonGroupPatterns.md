# ButtonGroupPatterns

**Import:** `import { ButtonGroupPatterns } from "./components/ButtonGroupPatterns"`
**Category:** components

## Props

- `layout`: "inline" | "stacked"
- `pattern`: "primary-secondary" | "primary-tertiary" | "secondary-tertiary" | "tertiary-tertiary" | "three-options"
- `preferredLabel`: string
- `alternateLabel`: string
- `thirdLabel`: string
- `preferredRight`: boolean
- `fullWidth`: boolean
- `onPreferred`: MouseEventHandler<HTMLButtonElement>
- `onAlternate`: MouseEventHandler<HTMLButtonElement>
- `onThird`: MouseEventHandler<HTMLButtonElement>
- `preferredButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">
- `alternateButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">
- `thirdButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
