import { Button } from './ui/button'
import { executeCode } from '@/routes/api/execute'
import { languagesVersions } from './LanguageSelector'
import { useMutation } from '@tanstack/react-query'
import { Spinner } from './ui/spinner'
import { toast } from 'sonner'
import { useState } from 'react'

export default function Output({
  editRef,
  language,
}: {
  editRef: any
  language: keyof typeof languagesVersions
}) {
  const [Output, setOutput] = useState('')
  const [isError, SetError] = useState(false)
  const { data, isPending, mutate } = useMutation({
    mutationFn: async (sourceCode: string) => {
      try {
        const { run: result } = await executeCode(language, sourceCode)
        setOutput(result.output)
        result.stderr && SetError(true)
      } catch (error) {
        toast.error('An error has occurred', {
          style: {
            background: '#ff6467',
          },
        })
      }
    },
  })

  function runCode() {
    SetError(false)
    setOutput('')
    const sourceCode = editRef.current?.getValue()
    if (!sourceCode) return
    mutate(sourceCode)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Output</h3>
        <Button onClick={runCode} disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Executing
            </>
          ) : (
            'Run Code'
          )}
        </Button>
      </div>
      <div
        className={`min-h-50 max-h-100 overflow-auto rounded-md border p-4 font-mono text-sm ${
          isError ? 'bg-red-950/20 border-destructive' : 'bg-secondary'
        }`}
      >
        {Output ? (
          <pre className="whitespace-pre-wrap wrap-break-word">{Output}</pre>
        ) : (
          <span className="text-muted-foreground">
            Click "Run Code" to see output
          </span>
        )}
      </div>
    </div>
  )
}
