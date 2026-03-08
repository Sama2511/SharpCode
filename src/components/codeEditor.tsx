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
import { ModeToggle } from './ui/mode-toggle'
import { useTheme } from './ui/theme-provider'
import ReactMarkdown from 'react-markdown'

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
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { width, height } = useWindowSize()
  const { theme } = useTheme()

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
      <div className="flex items-center h-14 gap-2 px-4 border-2 bg-popover rounded-2xl mx-2 mt-2">
        <LanguageSelector lang={language} onSelect={onSelectLanguage} />
        <TopicSelector
          language={language}
          topic={topic}
          onSelect={onSelectTopic}
          invalid={invalid}
        />
        <Difficulty difficulty={difficulty} onSelect={onSelectDifficulty} />

        {/* Center buttons */}
        <div className="flex items-center gap-2 mx-auto">
          <Button
            onClick={requestQuestion}
            disabled={isLoading || verifying}
            size="sm"
            variant="secondary"
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
          <Button
            onClick={runCode}
            disabled={isPending || code === ''}
            size="sm"
            className="cursor-pointer"
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
            disabled={question === 'Press "Get Question" Button' || hintLoading}
            variant="secondary"
            size="sm"
            className="cursor-pointer"
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
            <Button variant="default" size="sm" disabled>
              <Spinner /> Checking
            </Button>
          ) : (
            <Button
              onClick={verifyAnswer}
              disabled={
                question === 'Press "Get Question" Button' || code === ''
              }
              size="sm"
              className="cursor-pointer"
            >
              Check Answer
            </Button>
          )}
        </div>

        <ModeToggle />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor + Output */}
        <div className="flex flex-col flex-1 overflow-hidden p-2 gap-2">
          <div className="h-[60%] rounded-2xl overflow-hidden border-2 border-border">
            <Editor
              height="100%"
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              language={language}
              onMount={onMount}
              value={code}
              onChange={(value: any) => setCode(value)}
              onValidate={(markers) =>
                setValidationErrors(markers.map((m) => m.message))
              }
              options={{
                fontSize: 18,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                padding: { top: 10 },
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto border-2 rounded-2xl border-border">
            <Output
              output={output}
              isError={isError}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        {/* Right: Question panel */}
        <div className="w-150 shrink-0 flex flex-col m-2 ml-0">
          <div className="p-4 flex-1 overflow-y-auto border-2 rounded-2xl border-border bg-popover h-full m-0">
            <p className="underline underline-offset-2 font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Challenge
            </p>
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground">
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
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
          className={`bg-popover border-2 ${isCorrect ? 'border-emerald-500' : 'border-red-500'}`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl underline underline-offset-4">
              {isCorrect ? 'Nailed it!' : 'Not quite right'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-[17px]">
            {evaluation}
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="secondary" className="cursor-pointer w-fit m-auto">
              {isCorrect ? 'Next challenge' : 'Try again'}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Hint dialog */}
      <Dialog
        open={hint !== ''}
        onOpenChange={(open) => {
          if (!open) setHint('')
        }}
      >
        <DialogContent showCloseButton={false} className="bg-popover">
          <DialogHeader>
            <DialogTitle className="text-xl underline underline-offset-4 ">
              Hint
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-[17px]">{hint}</DialogDescription>
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="cursor-pointer w-fit m-auto "
            >
              Got it
            </Button>
          </DialogClose>
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
