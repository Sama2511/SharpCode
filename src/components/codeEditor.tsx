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
      />
      <Output editRef={editRef} language={language} />
    </div>
  )
}
