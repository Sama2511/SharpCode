import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export const languagesVersions = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '13.2.0',
}
const languages = Object.entries(languagesVersions)
const languageLabels: Record<keyof typeof languagesVersions, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'C++',
}
export default function LanguageSelector({
  lang,
  onSelect,
}: {
  lang: keyof typeof languagesVersions
  onSelect: (lang: keyof typeof languagesVersions) => void
}) {
  return (
    <Select value={lang} onValueChange={onSelect}>
      <SelectTrigger className="w-36 h-full">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {languages.map(([language]) => (
            <SelectItem
              className="cursor-pointer"
              key={language}
              value={language}
            >
              {languageLabels[language as keyof typeof languagesVersions]}
              &nbsp;
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
