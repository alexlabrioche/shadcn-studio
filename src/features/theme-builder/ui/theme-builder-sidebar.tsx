import { LayoutTemplateIcon, PaletteIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/sidebar'
import type { ThemeBuilderView } from '@/features/theme-builder/ui/theme-builder-page'

interface ThemeBuilderSidebarProps {
  activeView: ThemeBuilderView
}

export function ThemeBuilderSidebar({ activeView }: ThemeBuilderSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="bg-sidebar-accent/60 flex items-center justify-between rounded-md px-2 py-1.5">
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
                <SidebarMenuButton
                  asChild
                  isActive={activeView === 'mvp-preview'}
                  tooltip="MVP Preview"
                >
                  <Link to="/mvp-preview">
                    <LayoutTemplateIcon />
                    <span>MVP Preview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeView === 'theme-designer'}
                  tooltip="Theme Designer"
                >
                  <Link to="/theme-designer">
                    <PaletteIcon />
                    <span>Theme Designer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="text-sidebar-foreground/70 px-2 text-xs group-data-[collapsible=icon]:hidden">
          Cmd/Ctrl + B toggles sidebar
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
