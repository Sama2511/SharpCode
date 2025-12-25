import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'
import LanguageSelector from './LanguageSelector'

export default function CodeEditor() {
  const editRef = useRef(null)
  const [language, setLanguage] = useState('javascript')
  const [Value, setValue] = useState('')

  const onMount = (editor: any) => {
    editRef.current = editor
    editor.focus()
  }

  const onSelect = (language: string) => {
    setLanguage(language)
  }

  return (
    <div>
      <LanguageSelector lang={language} onSelect={onSelect} />
      <Editor
        height="90vh"
        theme="vs-dark"
        language={language}
        onMount={onMount}
        value={Value}
        onChange={(Value: any) => setValue(Value)}
      />
    </div>
  )
}
