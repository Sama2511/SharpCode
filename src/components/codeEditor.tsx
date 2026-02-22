import { Editor } from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector, { languagesVersions } from './LanguageSelector'
import Output from './Output'
import TopicSelector from './TopicSelector'
import Difficulty from './Difficulty'

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] =
    useState<keyof typeof languagesVersions>('javascript')
  const [Value, setValue] = useState('')
  const [Concept, setConcept] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const onMount = (editor: any) => {
    editRef.current = editor
    editor.focus()
  }

  const onSelect = (language: keyof typeof languagesVersions) => {
    setLanguage(language)
    setConcept('')
  }
  const onSelectTopic = (topic: string) => {
    setConcept(topic)
  }
  const onSelectDifficulty = (difficulty: string) => {
    setDifficulty(difficulty)
  }

  return (
    <div>
      <div className="flex items-center h-20 gap-2.5 pl-5">
        <div className="flex gap-2  ">
          <LanguageSelector lang={language} onSelect={onSelect} />
          <TopicSelector
            language={language}
            topic={Concept}
            onSelect={onSelectTopic}
          />
        </div>
        <Difficulty difficulty={difficulty} onSelect={onSelectDifficulty} />
      </div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language={language}
        onMount={onMount}
        value={Value}
        onChange={(Value: any) => setValue(Value)}
        options={{
          fontSize: 20,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          minimap: { enabled: true },
          // scrollBeyondLastLine: false,
          lineNumbers: 'on',
          // roundedSelection: true,
          // automaticLayout: true,
          padding: { top: 10 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          // bracketPairColorization: { enabled: true },
          // renderLineHighlight: 'all',
          tabSize: 2,
        }}
      />
      <Output editRef={editRef} language={language} />
    </div>
  )
}
