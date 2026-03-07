import { executeCode } from '@/routes/api/execute'
import { languagesVersions } from '@/components/LanguageSelector'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'

export function useRunCode(
  editRef: React.RefObject<any>,
  language: keyof typeof languagesVersions,
) {
  const [output, setOutput] = useState('')
  const [isError, setIsError] = useState(false)

  const { isPending, mutate } = useMutation({
    mutationFn: async (sourceCode: string) => {
      try {
        const { run: result } = await executeCode(language, sourceCode)
        setOutput(result.output)
        result.stderr && setIsError(true)
      } catch (error) {
        toast.error('An error has occurred', {
          style: { background: '#ff6467' },
        })
      }
    },
  })

  function runCode() {
    setIsError(false)
    setOutput('')
    const sourceCode = editRef.current?.getValue()
    if (!sourceCode) return
    mutate(sourceCode)
  }

  return { output, isError, isPending, runCode }
}
