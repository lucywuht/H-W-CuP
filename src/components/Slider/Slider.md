# Slider

**Import:** `import { Slider } from "./components/Slider"`
**Category:** components

## Props

- `min`: number — Minimum value.
- `max`: number — Maximum value.
- `step`: number — Step increment.
- `value`: number[] — Controlled value. Provide `[number]` for a single-value slider or
- `defaultValue`: number[] — Uncontrolled default value.
- `onValueChange`: (value: number[]) => void — Callback fired on value change.
- `disabled`: boolean — Disable the slider.
- `size`: "large" | "small" — Visual size variant.
- `orientation`: "horizontal" | "vertical" — Orientation. Currently only horizontal is implemented.
- `label`: ReactNode — Label rendered at the top-left of the slider.
- `valueLabel`: ReactNode | boolean — Value rendered at the top-right of the slider. Pass a node to show a
- `minLabel`: ReactNode — Caption rendered at the bottom-left (e.g. the minimum).
- `maxLabel`: ReactNode — Caption rendered at the bottom-right (e.g. the maximum).
- `name`: string — Hidden input name for form submission.