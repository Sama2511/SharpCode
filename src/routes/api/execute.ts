import axios from 'axios'
import { languagesVersions } from '../../components/LanguageSelector'

const API = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
})

export const executeCode = async (
  language: keyof typeof languagesVersions,
  sourcecode: string,
) => {
  const response = await API.post('/execute', {
    language: language,
    version: languagesVersions[language],
    files: [
      {
        content: sourcecode,
      },
    ],
  })
  return response.data
}

export const getLanguages = async () => {
  const response = await fetch('https://emkc.org/api/v2/piston/runtimes')
  const data = await response.json()

  const wantedLanguages = Object.keys(languagesVersions)
  const filtered = data.filter(
    (runtime: any) =>
      wantedLanguages.includes(runtime.language) &&
      languagesVersions[runtime.language as keyof typeof languagesVersions] ===
        runtime.version,
  )

  console.log('Filtered languages:', filtered)
  return filtered
}
