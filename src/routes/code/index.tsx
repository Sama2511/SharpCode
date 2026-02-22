import CodeEditor from '@/components/codeEditor'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/code/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <CodeEditor />
    </div>
  )
}
