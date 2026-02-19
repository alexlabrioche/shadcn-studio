import { ThemeBuilderScreen } from '@/web'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/theme-builder')({
  component: ThemeBuilderRoute,
})

function ThemeBuilderRoute() {
  return <ThemeBuilderScreen />
}
