import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'

export default function Difficulty({
  difficulty,
  onSelect,
}: {
  difficulty: string
  onSelect: (difficulty: string) => void
}) {
  return (
    <ToggleGroup
      type="single"
      value={difficulty}
      className=" h-fit"
      variant="outline"
      onValueChange={onSelect}
    >
      <ToggleGroupItem
        value="Easy"
        className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
      >
        Easy
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Intermediate"
        className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
      >
        Intermediate
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Hard"
        className="data-[state=on]:bg-red-500 data-[state=on]:text-white"
      >
        Hard
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
