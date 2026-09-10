# ListMembersItem

**Import:** `import { ListMembersItem } from "./patterns/ListMembers"`
**Category:** patterns

## Composition

`ListMembersItem` is part of a compound component. Use together with: `ListMembers`, `ListMembersList`.

All pieces import from the same path (`./patterns/ListMembers`). See each sibling's `.md` for its API.

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
- `monitoringGoals`: ListMembersAssignedGoal[]
- `alert`: ReactNode
- `tag`: "absent" | "tardy" | "unavailable" | "removed" | "do-not-disturb" | "meal" | "ppto" | "not-scheduled" | ListMembersTagCustom