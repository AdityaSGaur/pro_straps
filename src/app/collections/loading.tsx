export default function CollectionsLoading() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-10 w-64 bg-muted rounded-xl" />
        <div className="h-4 w-96 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border/40 bg-muted/40 p-4 h-80 flex flex-col justify-between">
            <div className="w-full aspect-square bg-muted rounded-2xl" />
            <div className="space-y-2 pt-3">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-5 w-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
