import axios from 'axios'
import { languagesVersions } from '../../components/LanguageSelector'

const wandboxCompilers: Record<keyof typeof languagesVersions, string> = {
  javascript: 'nodejs-20.17.0',
  typescript: 'typescript-5.6.2',
  python: 'cpython-3.10.15',
  java: 'openjdk-jdk-22+36',
  csharp: 'dotnetcore-8.0.402',
}

const API = axios.create({
  baseURL: 'https://wandbox.org/api',
})

export const executeCode = async (
  language: keyof typeof languagesVersions,
  sourcecode: string,
) => {
  const compiler = wandboxCompilers[language]
  const response = await API.post('/compile.json', {
    compiler,
    code: sourcecode,
  })

  const data = response.data
  const output = data.program_output || ''
  const stderr = data.program_error || data.compiler_error || ''

  return {
    run: {
      output: output || stderr,
      stderr,
    },
  }
}
