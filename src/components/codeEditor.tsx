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

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] =
    useState<keyof typeof languagesVersions>('javascript')
  const [code, setCode] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [question, setQuestion] = useState('nothing yet')
  const [isLoading, setIsLoading] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [output, setOutput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [evaluation, setEvaluation] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
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
  return (
    <div>
      <div className="flex items-center h-20 gap-2.5 pl-5">
        <div className="flex gap-2  ">
          <LanguageSelector lang={language} onSelect={onSelectLanguage} />
          <TopicSelector
            language={language}
            topic={topic}
            onSelect={onSelectTopic}
            invalid={invalid}
          />
        </div>
        <Difficulty difficulty={difficulty} onSelect={onSelectDifficulty} />
      </div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language={language}
        onMount={onMount}
        value={code}
        onChange={(value: any) => setCode(value)}
        options={{
          fontSize: 20,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          minimap: { enabled: true },
          lineNumbers: 'on',
          padding: { top: 10 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          tabSize: 2,
        }}
      />
      <Output editRef={editRef} language={language} onOutput={setOutput} />
      <div className="w-100 p-4">
        <div className="flex gap-2">
          <Button
            onClick={requestQuestion}
            disabled={isLoading || verifying}
            className="cursor-pointer"
          >
            get question
          </Button>
          {verifying ? (
            <Button variant="outline" disabled>
              Checking
              <Spinner />
            </Button>
          ) : (
            <>
              <Button
                onClick={verifyAnswer}
                disabled={question == 'nothing yet' || code == ''}
                variant="outline"
                className="cursor-pointer"
              >
                Check
              </Button>
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
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {isCorrect ? 'Next challenge' : 'Try again'}
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          {isCorrect && (
            <Confetti
              width={width}
              height={height}
              confettiSource={{ x: width / 2, y: height / 2, w: 0, h: 0 }}
              initialVelocityY={{ min: -15, max: -5 }}
            />
          )}
        </div>
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
