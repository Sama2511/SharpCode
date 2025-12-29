import CodeEditor from '@/components/codeEditor'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'
import { useState } from 'react'

export const Route = createFileRoute('/code/')({
  component: RouteComponent,
})
const getQuestion = createServerFn().handler(async () => {
  const client = new OpenAI()
  const response = await client.responses.create({
    model: 'gpt-5.2',
    input: [
      {
        role: 'user',
        content:
          'Generate one coding challenge for a intermediate programmer, its should be 2 lines of description no more, language javascript ',
      },
    ],
  })
  return response.output_text
})

function RouteComponent() {
  const [question, setQuestion] = useState('nothing yet')
  const [isLoading, setIsLoading] = useState(false)
  async function requestQuestion() {
    setIsLoading(true)
    try {
      const question = await getQuestion()
      setQuestion(question)
    } catch (error) {
      setQuestion('Failed to load question')
    }
    setIsLoading(false)
  }
  return (
    <div>
      <CodeEditor />
      <div className="w-[400px] p-4">
        <Button onClick={requestQuestion} disabled={isLoading}>
          get question
        </Button>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <p>Preparing the question</p>
            <Spinner />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap wrap-break-word">{question}</pre>
        )}
      </div>
    </div>
  )
}
