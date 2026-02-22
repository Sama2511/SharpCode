import { Editor } from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector, { languagesVersions } from './LanguageSelector'
import Output from './Output'
import TopicSelector from './TopicSelector'

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] =
    useState<keyof typeof languagesVersions>('javascript')
  const [Value, setValue] = useState('')
  const [concept, setConcept] = useState('')
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

  return (
    <div>
      <div className="flex gap-2">
        <LanguageSelector lang={language} onSelect={onSelect} />
        <TopicSelector
          language={language}
          topic={concept}
          onSelect={onSelectTopic}
        />
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
