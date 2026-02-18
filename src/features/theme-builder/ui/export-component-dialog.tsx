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

interface ExportComponentDialogProps {
  exportComponentTsx: string
}

export function ExportComponentDialog({
  exportComponentTsx,
}: ExportComponentDialogProps) {
  const [copiedComponent, setCopiedComponent] = React.useState(false)

  React.useEffect(() => {
    if (!copiedComponent) {
      return
    }

    const timeout = window.setTimeout(() => setCopiedComponent(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [copiedComponent])

  const downloadComponentTsx = React.useCallback(() => {
    const blob = new Blob([exportComponentTsx], {
      type: 'text/plain;charset=utf-8',
    })
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'button.tsx'
    link.click()
    window.URL.revokeObjectURL(objectUrl)
  }, [exportComponentTsx])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Export Component</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Component TSX Export</DialogTitle>
          <DialogDescription>
            This exports the raw shadcn button component definition as a
            copy-ready `.tsx` file, including any custom color-pair variants you
            opted into.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted max-h-90 overflow-auto overscroll-contain rounded-md border p-3">
          <pre className="text-xs leading-5 whitespace-pre-wrap">
            <code>{exportComponentTsx}</code>
          </pre>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={downloadComponentTsx}>
            Download .tsx
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await navigator.clipboard.writeText(exportComponentTsx)
              setCopiedComponent(true)
            }}
          >
            {copiedComponent ? 'Copied' : 'Copy TSX'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
