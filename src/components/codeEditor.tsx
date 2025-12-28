import { Editor } from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector, { languagesVersions } from './LanguageSelector'
import Output from './Output'

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] =
    useState<keyof typeof languagesVersions>('javascript')
  const [Value, setValue] = useState('')

  const onMount = (editor: any) => {
    editRef.current = editor
    editor.focus()
  }

  const onSelect = (language: keyof typeof languagesVersions) => {
    setLanguage(language)
  }

  return (
    <div>
      <LanguageSelector lang={language} onSelect={onSelect} />
      <Editor
        height="40vh"
        theme="vs-dark"
        language={language}
        onMount={onMount}
        value={Value}
        onChange={(Value: any) => setValue(Value)}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: true,
          automaticLayout: true,
          padding: { top: 10 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'all',
          tabSize: 2,
        }}
      />
      <Output editRef={editRef} language={language} />
    </div>
  )
}
