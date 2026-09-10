# ListGoal

**Import:** `import { ListGoal } from "./patterns/ListGoal"`
**Category:** patterns

## Props

- `type`: "default" | "ai"
- `goalName`: string (required)
- `illustrationSrc`: string — Renders a `PlaceholderMedia` with this label inside it.
- `illustrationAlt`: string
- `showTag`: boolean
- `tagLabel`: string
- `tagVariant`: "primary" | "secondary" | "tertiary"
- `tagColor`: TagColor
- `progressTitle`: string
- `showProgressBar`: boolean
- `progressValue`: number
- `progressLabel`: string
- `progressValueLabel`: string
- `children`: ReactNode
- `showInsight`: boolean
- `insightLabel`: string
- `showAlert`: boolean
- `alertMessage`: string
- `alertAction`: string
- `onAlertAction`: () => void
- `showNavigation`: boolean
- `onNavigate`: () => void
- `showDivider`: boolean