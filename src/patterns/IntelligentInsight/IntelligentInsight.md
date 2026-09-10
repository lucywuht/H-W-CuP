# IntelligentInsight

**Import:** `import { IntelligentInsight } from "./patterns/IntelligentInsight"`
**Category:** patterns

## Props

- `label`: string (required) — Eyebrow/insight text shown next to the Sidekick logo.
- `title`: string — Optional recommendation title. When present, the card uses the expanded recommendation layout.
- `description`: string — Optional body copy shown under the title.
- `attributes`: IntelligentInsightAttribute[] — Attribute rows shown under the description.
- `showButton`: boolean — Show the full-width action button below the label.
- `buttonLabel`: string — Label for the action button.
- `onButtonClick`: MouseEventHandler<HTMLButtonElement> — Fires when the action button is clicked.