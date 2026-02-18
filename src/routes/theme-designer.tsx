import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/theme-designer')({
  component: ThemeDesignerRedirect,
})

function ThemeDesignerRedirect() {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate({ to: '/theme-builder', replace: true })
  }, [navigate])

  return null
}
