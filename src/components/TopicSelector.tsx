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
import { languagesVersions } from './LanguageSelector'

export const concepts = {
  javascript: [
    'Variables & Data Types',
    'Functions',
    'Arrays & Objects',
    'Promises & Async/Await',
    'ES6+ Features',
    'DOM Manipulation',
    'Error Handling',
  ],
  typescript: [
    'Type Annotations',
    'Interfaces & Types',
    'Generics',
    'Enums',
    'Classes & Access Modifiers',
    'Utility Types',
    'Type Guards',
  ],
  python: [
    'Variables & Data Types',
    'Functions',
    'Lists & Dictionaries',
    'Classes & OOP',
    'List Comprehensions',
    'Decorators',
    'Exception Handling',
  ],
  java: [
    'Variables & Data Types',
    'Classes & Objects',
    'Inheritance & Polymorphism',
    'Interfaces',
    'Collections',
    'Generics',
    'Exception Handling',
  ],
  csharp: [
    'Variables & Data Types',
    'Classes & Objects',
    'Inheritance & Polymorphism',
    'Interfaces',
    'LINQ',
    'Async & Await',
    'Delegates & Events',
  ],
}
export default function TopicSelector({
  language,
  topic,
  onSelect,
}: {
  language: keyof typeof languagesVersions
  topic: string
  onSelect: (topic: string) => void
}) {
  return (
    <Select value={topic} onValueChange={onSelect}>
      <SelectTrigger className="w-fit h-full ">
        <SelectValue placeholder="Select a concept" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Topic</SelectLabel>
          {concepts[language].map((concept) => {
            return (
              <SelectItem value={concept} key={concept}>
                {concept}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
