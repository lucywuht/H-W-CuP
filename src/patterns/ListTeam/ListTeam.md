# ListTeam

**Import:** `import { ListTeam } from "./patterns/ListTeam"`
**Category:** patterns

## Props

- `variant`: "navigational" | "selectable"
- `state`: "default" | "pressed" | "selected" — Selected is intended for selectable rows.
- `title`: string (required)
- `subtitle`: string
- `illustrationLabel`: string
- `illustrationElement`: ReactNode
- `attribute1`: string
- `attribute2`: string
- `tagLabel`: string
- `starred`: boolean
- `starAriaLabel`: string
- `onStarPress`: () => void
- `onPress`: () => void