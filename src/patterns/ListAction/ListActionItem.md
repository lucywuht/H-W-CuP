# ListActionItem

**Import:** `import { ListActionItem } from "./patterns/ListAction"`
**Category:** patterns

## Composition

`ListActionItem` is part of a compound component. Use together with: `ListAction`, `ListActionList`.

All pieces import from the same path (`./patterns/ListAction`). See each sibling's `.md` for its API.

## Props

- `eyebrow`: string
- `title`: string (required)
- `text`: string
- `leading`: "empty" | "custom"
- `leadingContent`: ReactNode
- `trailing`: "empty" | "icon" | "link" | "select"
- `trailingIcon`: ReactNode — Falls back to ChevronRightIcon.
- `trailingLink`: { text: string; href?: string; onClick?: () => void }
- `trailingChecked`: boolean
- `onTrailingCheckedChange`: (checked: boolean) => void
- `attributes`: Array<{ label: string; icon?: ReactNode }> — Up to 3 Attribute small rows.
- `divider`: boolean — Renders a Divider at the bottom of the item.
- `footerAction`: ReactNode
- `alert`: ReactNode
- `tag`: "unassigned" | "assigned" | "complete" | ListActionTagCustom