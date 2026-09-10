# AutoCareModals

**Import:** `import { AutoCareModals } from "./patterns/AutoCareModals"`
**Category:** patterns

## Props

- `openModal`: "checkIn" | "reschedule" | "viewDetails" | null (required)
- `onClose`: () => void (required)
- `onSwitchToCheckIn`: () => void (required)
- `onSwitchToReschedule`: () => void (required)
- `serviceDetails`: ServiceDetails
- `location`: string
- `statusHeading`: string
- `orderTotal`: string