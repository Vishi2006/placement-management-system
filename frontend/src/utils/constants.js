export const statusColorMap = {
  Pending: 'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-blue-100 text-blue-700',
  Selected: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Passed: 'bg-emerald-100 text-emerald-700',
  Failed: 'bg-rose-100 text-rose-700',
}

export const studentMenu = [
  { label: 'Overview', to: '/student' },
  { label: 'Jobs', to: '/student/jobs' },
  { label: 'Applications', to: '/student/applications' },
  { label: 'Interviews', to: '/student/interviews' },
  { label: 'Profile', to: '/student/profile' },
]

export const adminMenu = [
  { label: 'Overview', to: '/admin' },
  { label: 'Companies', to: '/admin/companies' },
  { label: 'Jobs', to: '/admin/jobs' },
  { label: 'Applications', to: '/admin/applications' },
  { label: 'Schedule', to: '/admin/schedule' },
  { label: 'Interviews', to: '/admin/interviews' },
]
