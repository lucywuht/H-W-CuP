# DelayedDeliveryModals

**Import:** `import { DelayedDeliveryModals } from "./patterns/DelayedDeliveryModals"`
**Category:** patterns

## Props

- `openModal`: "reschedule" | "pickupInstead" | "viewDetails" | "cancel" | null (required)
- `onClose`: () => void (required)
- `orderTotal`: string