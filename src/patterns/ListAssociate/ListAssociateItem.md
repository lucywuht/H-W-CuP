# ListAssociateItem

**Import:** `import { ListAssociateItem } from "./patterns/ListAssociate"`
**Category:** patterns

## Composition

`ListAssociateItem` is part of a compound component. Use together with: `ListAssociate`, `ListAssociateList`.

All pieces import from the same path (`./patterns/ListAssociate`). See each sibling's `.md` for its API.

## Props

- `eyebrow`: string
- `title`: string (required)
- `text`: string
- `leading`: "empty" | "custom"
- `leadingContent`: ReactNode
- `trailing`: "empty" | "icon" | "link" | "select"
- `trailingIcon`: ReactNode
- `trailingLink`: { text: string; href?: string; onClick?: () => void }
- `trailingChecked`: boolean
- `onTrailingCheckedChange`: (checked: boolean) => void
- `attributes`: Array<{ label: string; icon?: ReactNode }>
- `divider`: boolean
- `footerAction`: ReactNode
- `monitoring`: ReactNode — Pass a `core/ProgressIndicator` (or any node).
- `monitoringLabel`: string
- `monitoringGoals`: ListAssociateAssignedGoal[]
- `alert`: ReactNode
- `tag`: "absent" | "tardy" | "unavailable" | "removed" | "do-not-disturb" | "meal" | "ppto" | "not-scheduled" | ListAssociateTagCustom