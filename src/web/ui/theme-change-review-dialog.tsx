import * as React from 'react'

import { Badge } from '@/web/ui/primitives/badge'
import { Button } from '@/web/ui/primitives/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/web/ui/primitives/dialog'
import type { ThemePreviewPatch } from '@/web/model/patch'

interface ApplyReportEntry {
  targetPath: string
  status: 'applied' | 'unchanged'
}

interface ThemeChangeReviewDialogProps {
  patches: ThemePreviewPatch[]
  applyReport: ApplyReportEntry[]
}

export function ThemeChangeReviewDialog({
  patches,
  applyReport,
}: ThemeChangeReviewDialogProps) {
  const changedPatches = React.useMemo(
    () => patches.filter((patch) => patch.hasChanges),
    [patches],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={changedPatches.length === 0}>
          Review Changes
          {changedPatches.length > 0 ? (
            <Badge variant="secondary" className="ml-2 h-5 text-[10px]">
              {changedPatches.length}
            </Badge>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pending File Diffs</DialogTitle>
          <DialogDescription>
            Review generated per-file diffs before applying theme changes.
          </DialogDescription>
        </DialogHeader>

        {changedPatches.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending file changes.</p>
        ) : (
          <div className="space-y-3">
            {changedPatches.map((patch) => (
              <section key={patch.targetPath} className="space-y-2">
                <p className="text-sm font-medium">{patch.targetPath}</p>
                <div className="bg-muted max-h-[240px] overflow-auto rounded-md border p-3">
                  <pre className="text-xs leading-5 whitespace-pre-wrap">
                    <code>{patch.diff}</code>
                  </pre>
                </div>
              </section>
            ))}
          </div>
        )}

        {applyReport.length > 0 ? (
          <div className="space-y-2 rounded-md border p-3">
            <p className="text-sm font-medium">Last Apply Result</p>
            <ul className="space-y-1 text-xs">
              {applyReport.map((entry) => (
                <li key={`${entry.targetPath}-${entry.status}`}>
                  {entry.targetPath}: {entry.status}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
