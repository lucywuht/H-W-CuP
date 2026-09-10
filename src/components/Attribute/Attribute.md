# Attribute

**Import:** `import { Attribute } from "./components/Attribute"`
**Category:** components

## Props

- `label`: string (required) — Display label.
- `size`: "small" | "large"
- `color`: "default" | "brand" | "negative" | "inverse" | "highlight"
- `icon`: ReactNode — Leading icon. Defaults to the LD `Tag` icon.
- `additionalLabel`: boolean — When true, appends `→ label2` after the label.
- `label2`: string — Secondary label rendered when `additionalLabel` is true.