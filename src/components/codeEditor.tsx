import { Editor } from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector, { languagesVersions } from './LanguageSelector'
import Output from './Output'
import TopicSelector from './TopicSelector'
import Difficulty from './Difficulty'

import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { getQuestion } from '@/actions/question'

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
      <Output editRef={editRef} language={language} />
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
