import { Editor } from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector, { languagesVersions } from './LanguageSelector'
import Output from './Output'
import TopicSelector from './TopicSelector'
import Difficulty from './Difficulty'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { getQuestion } from '@/actions/question'
import { checkAnswer } from '@/actions/checkAnswer'
import { getHint } from '@/actions/hint'
import { useRunCode } from '@/hooks/useRunCode'

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] =
    useState<keyof typeof languagesVersions>('javascript')
  const [code, setCode] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [question, setQuestion] = useState('Press "Get Question" Button')
  const [isLoading, setIsLoading] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const { output, isError, isPending, runCode } = useRunCode(editRef, language)

  const [verifying, setVerifying] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [evaluation, setEvaluation] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [hint, setHint] = useState('')
  const [hintLoading, setHintLoading] = useState(false)
  const { width, height } = useWindowSize()

  const onMount = (editor: any) => {
    editRef.current = editor
    editor.focus()
  }

  const onSelectLanguage = (lang: keyof typeof languagesVersions) => {
    setLanguage(lang)
    setTopic('')
  }
  const onSelectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic)
    setInvalid(false)
  }
  const onSelectDifficulty = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty)
  }

  async function requestQuestion() {
    if (topic === '') {
      setInvalid(true)
      return
    }
    setIsLoading(true)
    try {
      const result = await getQuestion({
        data: { language, topic, difficulty },
      })
      setQuestion(result)
    } catch (error) {
      setQuestion('Failed to load question')
      console.log(error)
    }
    setIsLoading(false)
  }

  async function verifyAnswer() {
    setVerifying(true)
    try {
      const feedback = await checkAnswer({ data: { question, code, output } })
      const lower = feedback.toLocaleLowerCase()
      setIsCorrect(lower.startsWith('correct'))
      const splitFeedback = feedback.split('—')
      setEvaluation(splitFeedback[1]?.trim() ?? feedback)
      setOpenDialog(true)
    } catch (error) {
      setEvaluation('Failed to check answer')
      setIsCorrect(false)
      setOpenDialog(true)
      console.log(error)
    }
    setVerifying(false)
  }

  async function requestHint() {
    setHintLoading(true)
    try {
      const result = await getHint({ data: { question, code } })
      setHint(result)
    } catch (error) {
      setHint('Failed to get hint')
      console.log(error)
    }
    setHintLoading(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Toolbar */}
      <div className="flex items-center h-14 gap-2 px-4 border-b border-border bg-card shrink-0">
        <LanguageSelector lang={language} onSelect={onSelectLanguage} />
        <TopicSelector
          language={language}
          topic={topic}
          onSelect={onSelectTopic}
          invalid={invalid}
        />
        <Difficulty difficulty={difficulty} onSelect={onSelectDifficulty} />
        <div className="ml-auto">
          <Button
            onClick={requestQuestion}
            disabled={isLoading || verifying}
            size="sm"
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner /> Generating
              </>
            ) : (
              'Get Question'
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor + Output */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Editor
            height="60%"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            value={code}
            onChange={(value: any) => setCode(value)}
            options={{
              fontSize: 16,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              minimap: { enabled: false },
              lineNumbers: 'on',
              padding: { top: 10 },
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              tabSize: 2,
            }}
          />
          <div className="flex-1 overflow-y-auto border-t border-border">
            <Output output={output} isError={isError} />
          </div>
        </div>

        {/* Right: Question panel */}
        <div className="w-80 shrink-0 flex flex-col border-l border-border bg-popover">
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text- mb-3">
              Challenge
            </p>
            <pre className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground">
              {question}
            </pre>
          </div>
          {/* Action buttons */}
          <div className="p-4 border-t border-border flex flex-col gap-2">
            <Button
              onClick={runCode}
              disabled={isPending || code === ''}
              size="sm"
              className="cursor-pointer w-full"
            >
              {isPending ? (
                <>
                  <Spinner /> Executing
                </>
              ) : (
                'Run Code'
              )}
            </Button>
            <Button
              onClick={requestHint}
              disabled={
                question === 'Press "Get Question" Button' || hintLoading
              }
              variant="outline"
              size="sm"
              className="cursor-pointer w-full"
            >
              {hintLoading ? (
                <>
                  <Spinner /> Getting hint
                </>
              ) : (
                'Get Hint'
              )}
            </Button>
            {verifying ? (
              <Button variant="default" size="sm" disabled className="w-full">
                <Spinner /> Checking
              </Button>
            ) : (
              <Button
                onClick={verifyAnswer}
                disabled={
                  question === 'Press "Get Question" Button' || code === ''
                }
                size="sm"
                className="cursor-pointer w-full"
              >
                Check Answer
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open)
          if (!open) setTimeout(() => setIsCorrect(false), 100)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="p-0 overflow-hidden gap-0"
        >
          <div
            className={`px-6 py-5 ${
              isCorrect
                ? 'bg-emerald-950/40 border-b border-emerald-800/50'
                : 'bg-red-950/40 border-b border-red-800/50'
            }`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
                <span
                  className={`inline-flex items-center justify-center size-8 rounded-full text-sm ${
                    isCorrect
                      ? 'bg-emerald-900/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {isCorrect ? '✓' : '✗'}
                </span>
                {isCorrect ? 'Nailed it!' : 'Not quite right'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="px-6 py-5">
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {evaluation}
            </DialogDescription>
          </div>
          <div className="px-6 pb-5 flex justify-end">
            <DialogClose asChild>
              <Button size="sm" variant="secondary" className="cursor-pointer">
                {isCorrect ? 'Next challenge' : 'Try again'}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hint dialog */}
      <Dialog
        open={hint !== ''}
        onOpenChange={(open) => {
          if (!open) setHint('')
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="p-0 overflow-hidden gap-0"
        >
          <div className="px-6 py-5 bg-blue-950/40 border-b border-blue-800/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
                <span className="inline-flex items-center justify-center size-8 rounded-full text-sm bg-blue-500/20 text-blue-400">
                  ?
                </span>
                Hint
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="px-6 py-5">
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {hint}
            </DialogDescription>
          </div>
          <div className="px-6 pb-5 flex justify-end">
            <DialogClose asChild>
              <Button size="sm" variant="secondary" className="cursor-pointer">
                Got it
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {isCorrect && (
        <Confetti
          width={width}
          height={height}
          confettiSource={{ x: width / 2, y: height / 2, w: 0, h: 0 }}
          initialVelocityY={{ min: -15, max: -5 }}
        />
      )}
    </div>
  )
}
