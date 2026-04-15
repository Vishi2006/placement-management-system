export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500 dark:text-slate-400">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  )
}
