import React from 'react'
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
  csharp: '6.12.0',
}
const languages = Object.entries(languagesVersions)
export default function LanguageSelector({
  lang,
  onSelect,
}: {
  lang: keyof typeof languagesVersions
  onSelect: (lang: keyof typeof languagesVersions) => void
}) {
  return (
    <Select value={lang} onValueChange={onSelect}>
      <SelectTrigger className="w-fit h-full ">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {languages.map(([language, version]) => (
            <SelectItem
              className="cursor-pointer"
              key={language}
              value={language}
            >
              {language}
              &nbsp;
              {/* <p>{version}</p> */}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
