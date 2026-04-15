import { statusColorMap } from '../../utils/constants'

export default function StatusBadge({ status = 'Pending' }) {
  const classes = statusColorMap[status] || 'bg-slate-100 text-slate-700'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  )
}
