import { ThemeBuilderScreen } from '@/features/theme-builder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mvp-preview')({
  component: MvpPreviewRoute,
})

function MvpPreviewRoute() {
  return <ThemeBuilderScreen activeView="mvp-preview" />
}
