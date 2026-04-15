export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="glass rounded-2xl border p-5 shadow-soft">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold">{value}</h3>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  )
}
