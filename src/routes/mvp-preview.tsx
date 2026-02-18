import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/mvp-preview')({
  component: MvpPreviewRedirect,
})

function MvpPreviewRedirect() {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate({ to: '/theme-builder', replace: true })
  }, [navigate])

  return null
}
