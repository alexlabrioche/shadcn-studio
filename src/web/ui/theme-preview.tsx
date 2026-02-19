import * as React from 'react'
import { AlertCircleIcon, TriangleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/web/ui/primitives/alert'
import { Badge } from '@/web/ui/primitives/badge'
import { Button } from '@/web/ui/primitives/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/web/ui/primitives/tabs'
import { Toggle } from '@/web/ui/primitives/toggle'
import { getThemeColorPair } from '@/shared/theme'
import type { MainTheme, ThemeMode } from '@/shared/theme'

interface ThemePreviewProps {
  theme: MainTheme
  mode: ThemeMode
}

export function ThemePreview({ theme, mode }: ThemePreviewProps) {
  const backgroundPair = getThemeColorPair(theme, mode, 'background')
  const cardPair = getThemeColorPair(theme, mode, 'card')
  const primaryPair = getThemeColorPair(theme, mode, 'primary')
  const secondaryPair = getThemeColorPair(theme, mode, 'secondary')
  const mutedPair = getThemeColorPair(theme, mode, 'muted')
  const accentPair = getThemeColorPair(theme, mode, 'accent')

  const previewStyle = {
    '--background': backgroundPair?.color ?? '#ffffff',
    '--foreground': backgroundPair?.foreground ?? '#111827',
    '--card': cardPair?.color ?? '#ffffff',
    '--card-foreground': cardPair?.foreground ?? '#111827',
    '--primary': primaryPair?.color ?? '#111827',
    '--primary-foreground': primaryPair?.foreground ?? '#f9fafb',
    '--secondary': secondaryPair?.color ?? '#f3f4f6',
    '--secondary-foreground': secondaryPair?.foreground ?? '#111827',
    '--muted': mutedPair?.color ?? '#f3f4f6',
    '--muted-foreground': mutedPair?.foreground ?? '#4b5563',
    '--accent': accentPair?.color ?? '#f3f4f6',
    '--accent-foreground': accentPair?.foreground ?? '#111827',
    '--border': mutedPair?.color ?? '#e5e7eb',
  } as React.CSSProperties

  return (
    <div
      className="min-h-full bg-background text-foreground"
      data-ds="preview"
      style={previewStyle}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Live Preview</h2>
            <p className="text-muted-foreground text-sm">
              Badge, alert, toggle, tabs, and button with your current tokens.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Badge variant="secondary">Actions</Badge>
              <Button>Primary Action</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Toggle aria-label="Bold" defaultPressed variant="outline">
                Bold
              </Toggle>
              <Toggle aria-label="Italic" variant="outline">
                Italic
              </Toggle>
              <Toggle aria-label="Underline" variant="outline">
                Underline
              </Toggle>
            </div>
          </div>

          <div className="space-y-3">
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Theme synced</AlertTitle>
              <AlertDescription>
                Your semantic pairs are applied in real time.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <TriangleAlertIcon />
              <AlertTitle>Destructive state</AlertTitle>
              <AlertDescription>
                Keep contrast readable for warning/error interactions.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-xl border border-border p-5">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent
              value="overview"
              className="bg-background mt-3 rounded-lg border border-border p-4"
            >
              <p className="text-sm">Primary and accent styling are active.</p>
            </TabsContent>
            <TabsContent
              value="states"
              className="bg-background mt-3 rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap gap-2">
                <Badge>Active</Badge>
                <Badge variant="secondary">Idle</Badge>
                <Badge variant="destructive">Blocked</Badge>
              </div>
            </TabsContent>
            <TabsContent
              value="notes"
              className="bg-background mt-3 rounded-lg border border-border p-4"
            >
              <p className="text-muted-foreground text-sm">
                Use this area to validate readability across interactive surfaces.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
