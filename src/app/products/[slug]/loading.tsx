export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-muted rounded-3xl" />
        <div className="space-y-6 pt-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded-xl" />
          <div className="h-8 w-32 bg-muted rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
          <div className="h-12 w-full bg-muted rounded-full" />
        </div>
      </div>
    </div>
  )
}
