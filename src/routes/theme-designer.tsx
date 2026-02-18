import { ThemeBuilderScreen } from '@/features/theme-builder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/theme-designer')({
  component: ThemeDesignerRoute,
})

function ThemeDesignerRoute() {
  return <ThemeBuilderScreen activeView="theme-designer" />
}
