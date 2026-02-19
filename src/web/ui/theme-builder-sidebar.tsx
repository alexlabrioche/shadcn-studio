import { PaletteIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/web/ui/primitives/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/web/ui/primitives/sidebar'
import { Switch } from '@/web/ui/primitives/switch'
import type { AppAppearance } from '@/shared/theme'

interface ThemeBuilderSidebarProps {
  appAppearance: AppAppearance
  onAppAppearanceChange: (appAppearance: AppAppearance) => void
}

export function ThemeBuilderSidebar({
  appAppearance,
  onAppAppearanceChange,
}: ThemeBuilderSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground grid size-6 shrink-0 place-items-center rounded-md">
              <PaletteIcon className="size-3.5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">Giga Shad</p>
              <p className="text-sidebar-foreground/70 truncate text-xs">
                Theme Workspace
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="h-5 text-[10px] group-data-[collapsible=icon]:hidden"
          >
            MVP
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Screens</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Theme Builder">
                  <Link to="/theme-builder">
                    <PaletteIcon />
                    <span>Theme Builder</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <label className="flex items-center justify-between gap-2 px-2 text-xs group-data-[collapsible=icon]:hidden">
          <span className="text-sidebar-foreground/70">Dark mode</span>
          <Switch
            checked={appAppearance === 'dark'}
            onCheckedChange={(checked) =>
              onAppAppearanceChange(checked ? 'dark' : 'light')
            }
            aria-label="Toggle app dark mode"
          />
        </label>
        <p className="text-sidebar-foreground/70 px-2 text-xs group-data-[collapsible=icon]:hidden">
          Cmd/Ctrl + B toggles sidebar
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
