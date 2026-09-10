# DropdownMenuRadioGroup

**Import:** `import { DropdownMenuRadioGroup } from "./components/DropdownMenu"`
**Category:** components

## Composition

`DropdownMenuRadioGroup` is part of a compound component. Use together with: `DropdownMenuSeparator`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuShortcut`.

All pieces import from the same path (`./components/DropdownMenu`). See each sibling's `.md` for its API.

## Props

- `value`: string
- `onValueChange`: (value: string) => void
- `children`: ReactNode

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
