# DelayedDeliveryCard

**Import:** `import { DelayedDeliveryCard } from "./patterns/DelayedDeliveryCard"`
**Category:** patterns

## Props

- `statusHeading`: string (required)
- `delayEstimate`: string (required)
- `products`: OrderProduct[] (required)
- `orderTotal`: string
- `onReschedule`: () => void
- `onPickupInstead`: () => void
- `onViewDetails`: () => void
- `onCancelOrder`: () => void