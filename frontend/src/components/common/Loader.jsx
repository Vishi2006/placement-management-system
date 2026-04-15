export default function Loader({ lines = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
      ))}
    </div>
  )
}
