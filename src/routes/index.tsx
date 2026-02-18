import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/')({ component: IndexRedirect })

function IndexRedirect() {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate({ to: '/theme-builder', replace: true })
  }, [navigate])

  return null
}
