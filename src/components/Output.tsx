export default function Output({
  output,
  isError,
  validationErrors,
}: {
  output: string
  isError: boolean
  validationErrors: string[]
}) {
  return (
    <div className="h-full flex flex-col bg-background font-mono text-sm ">
      {/* Terminal body */}
      <div className="flex-1 overflow-auto p-4 bg-popover">
        <div className="underline underline-offset-4 mb-4 text-foreground">
          Output
        </div>
        {output ? (
          <div className="flex gap-2 text-lg">
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
            <span className="text-foreground">❯</span>
            <span className="text-foreground italic">
              Run your code to see output...
            </span>
          </div>
        )}
        {validationErrors.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Errors
            </div>
            {validationErrors.map((err, i) => (
              <div key={i} className="flex gap-2 text-red-400 text-sm">
                <span>✗</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
