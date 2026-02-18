import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import type { CssExportColorFormat } from '@/features/theme-builder/model/theme'

interface ExportCssDialogProps {
  exportCss: string
  exportColorFormat: CssExportColorFormat
  onExportColorFormatChange: (format: CssExportColorFormat) => void
}

export function ExportCssDialog({
  exportCss,
  exportColorFormat,
  onExportColorFormatChange,
}: ExportCssDialogProps) {
  const [copiedCss, setCopiedCss] = React.useState(false)

  React.useEffect(() => {
    if (!copiedCss) {
      return
    }

    const timeout = window.setTimeout(() => setCopiedCss(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [copiedCss])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export CSS</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Theme CSS Export</DialogTitle>
          <DialogDescription>
            Copy and paste this snippet into your stylesheet. Choose the
            exported color format below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-md border p-3">
          <span className="text-sm">Export colors as</span>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={
                exportColorFormat === 'oklch'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }
            >
              OKLCH
            </span>
            <Switch
              checked={exportColorFormat === 'hex'}
              onCheckedChange={(checked) =>
                onExportColorFormatChange(checked ? 'hex' : 'oklch')
              }
              aria-label="Toggle color export format"
            />
            <span
              className={
                exportColorFormat === 'hex'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }
            >
              HEX
            </span>
          </div>
        </div>

        <div className="bg-muted max-h-[360px] overflow-auto rounded-md border p-3">
          <pre className="text-xs leading-5 whitespace-pre-wrap">
            <code>{exportCss}</code>
          </pre>
        </div>

        <DialogFooter>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(exportCss)
              setCopiedCss(true)
            }}
          >
            {copiedCss ? 'Copied' : 'Copy CSS'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
