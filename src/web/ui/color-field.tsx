import * as React from 'react'
import { Sketch } from '@uiw/react-color'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/web/ui/primitives/popover'
import { toHexColor } from '@/shared/theme'
import type { ThemeColor } from '@/shared/theme'

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
  const pickerColor = React.useMemo(
    () => toHexColor(value) ?? pickerFallbackHex,
    [pickerFallbackHex, value],
  )

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex shrink-0 items-center"
            aria-label={`Pick color for ${label}`}
          >
            <span
              aria-hidden="true"
              className="h-8 w-12 rounded-lg"
              style={{ backgroundColor: pickerColor }}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-0 bg-transparent p-0 shadow-none">
          <Sketch
            color={pickerColor}
            disableAlpha
            onChange={(color) => onChange(color.hex.toLowerCase())}
          />
        </PopoverContent>
      </Popover>

      <p className="truncate text-xs font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
