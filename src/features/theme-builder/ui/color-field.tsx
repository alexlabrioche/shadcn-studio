import * as React from 'react'
import { Colorful } from '@uiw/react-color'

import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  normalizeThemeColor,
  toHexColor,
} from '@/features/theme-builder/model/theme'
import type { ThemeColor } from '@/features/theme-builder/model/theme'

interface ColorFieldProps {
  label: string
  value: ThemeColor
  pickerFallbackHex: string
  onChange: (value: ThemeColor) => void
}

export function ColorField({
  label,
  value,
  pickerFallbackHex,
  onChange,
}: ColorFieldProps) {
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    setDraft(value)
  }, [value])

  const pickerColor = React.useMemo(
    () => toHexColor(value) ?? pickerFallbackHex,
    [pickerFallbackHex, value],
  )

  const isDraftValid =
    draft.trim().length === 0 || normalizeThemeColor(draft) !== null

  const commitDraft = React.useCallback(() => {
    const normalized = normalizeThemeColor(draft)
    if (!normalized) {
      setDraft(value)
      return
    }
    onChange(normalized)
    setDraft(normalized)
  }, [draft, onChange, value])

  return (
    <label className="block space-y-1 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="hover:bg-muted inline-flex shrink-0 items-center gap-3 rounded-md border px-2 py-2 text-sm"
            >
              <span
                aria-hidden="true"
                className="h-6 w-10 rounded-sm border border-border"
                style={{ backgroundColor: pickerColor }}
              />
              <span>Choose</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-0 bg-transparent p-0 shadow-none">
            <Colorful
              color={pickerColor}
              disableAlpha
              onChange={(color) => onChange(color.hex.toLowerCase())}
            />
          </PopoverContent>
        </Popover>

        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitDraft()
            }
            if (event.key === 'Escape') {
              setDraft(value)
            }
          }}
          aria-invalid={!isDraftValid || undefined}
          placeholder="#111827 or oklch(0.2 0.03 250)"
          className="font-mono text-xs"
        />
      </div>
    </label>
  )
}
