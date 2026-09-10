# Header

**Import:** `import { Header } from "./patterns/Header"`
**Category:** patterns
**Intent:** Full responsive site header (search / cart / account)

## Composition

`Header` is part of a compound component. Use together with: `HeaderDesktop`, `HeaderMobile`, `HeaderMobileTopNav`.

All pieces import from the same path (`./patterns/Header`). See each sibling's `.md` for its API.

## Props

- `cartCount`: number
- `cartPrice`: string
- `mobileVariant`: "classic" | "topnav-blue" | "topnav-white"
- `showMobileSubNav`: boolean
- `showMobileDeliveryBanner`: boolean