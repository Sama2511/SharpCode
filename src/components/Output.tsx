export default function Output({
  output,
  isError,
}: {
  output: string
  isError: boolean
}) {
  return (
    <div className="h-full flex flex-col bg-background font-mono text-sm border-t-2">
      {/* Terminal title bar */}
      {/* <div className="flex items-center gap-1.5 px-4 py-1.5 bg-popover border-b border-border shrink-0">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div> */}

      {/* Terminal body */}
      <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e]">
        <div className="underline underline-offset-4 mb-4">Output</div>
        {output ? (
          <div className="flex gap-2">
            <span className={isError ? 'text-red-400' : 'text-emerald-400'}>
              {isError ? '✗' : '❯'}
            </span>
            <pre
              className={`whitespace-pre-wrap wrap-break-word leading-relaxed ${
                isError ? 'text-red-400' : 'text-foreground'
              }`}
            >
              {output}
            </pre>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="text-white">❯</span>
            <span className="text-white italic">
              Run your code to see output...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
