export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-accent" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`route-loading-${index}`}
              className="h-28 animate-pulse rounded-xl bg-accent"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-accent" />
      </div>
    </div>
  );
}
