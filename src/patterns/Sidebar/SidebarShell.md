# SidebarShell

**Import:** `import { SidebarShell } from "./patterns/Sidebar"`
**Category:** patterns

## Composition

`SidebarShell` is part of a compound component. Use together with: `SidebarProvider`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `Sidebar`.

All pieces import from the same path (`./patterns/Sidebar`). See each sibling's `.md` for its API.

## Props

- `activeMenuItem`: string
- `onMenuItemClick`: (itemId: string, route: string) => void
- `menuItems`: SidebarShellMenuItem[] (required)
- `defaultLocked`: boolean
- `expanded`: boolean