import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { applicationApi } from '../../services/api'
import { theme } from '../../config/theme'

export default function ApplicationsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  const load = async () => {
    try {
      setRefreshing(true)
      const res = await applicationApi.myApplications()
      setRows(res.data || [])
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch applications')
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const deleteApplication = async (id, jobTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete your application for ${jobTitle}? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      await applicationApi.delete(id)
      toast.success('Application deleted successfully')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete application')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const getStatusColor = (status) => {
    const statuses = {
      Pending: theme.primary.DEFAULT,
      'Under Review': '#F97316',
      Selected: theme.accent,
      Rejected: '#EF4444',
    }
    return statuses[status] || statuses.Pending
  }

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      'Under Review': Clock,
      Selected: CheckCircle,
      Rejected: AlertCircle,
    }
    return icons[status] || Clock
  }

  const ApplicationCard = ({ app }) => {
    const StatusIcon = getStatusIcon(app.status)
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8 }}
        className="card group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {app.job?.title || 'Job Title'}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                {app.job?.company && typeof app.job.company === 'object'
                  ? app.job.company.name
                  : 'Company'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={app.status} />
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="flex-shrink-0" />
              <span>{app.job?.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <DollarSign size={16} className="flex-shrink-0" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {app.job?.package || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar size={16} className="flex-shrink-0" />
              <span>
                Applied:{' '}
                {app.appliedDate
                  ? new Date(app.appliedDate).toLocaleDateString()
                  : app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : 'N/A'}
              </span>
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex items-center gap-2 rounded-lg p-3" style={{ backgroundColor: `${getStatusColor(app.status)}15` }}>
            <StatusIcon size={18} style={{ color: getStatusColor(app.status) }} />
            <span className="text-sm font-medium" style={{ color: getStatusColor(app.status) }}>
              {app.status}
            </span>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => deleteApplication(app._id, app.job?.title || 'this job')}
            className="btn btn-danger w-full"
          >
            <Trash2 size={16} />
            <span>Delete Application</span>
          </button>
        </div>
      </motion.div>
    )
  }

  if (loading) return <Loader />

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card space-y-3 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
        </div>
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
      </motion.div>
    )

  if (!rows.length)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <EmptyState
          title="No applications yet"
          description="Apply to jobs to see your applications here."
        />
      </motion.div>
    )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Applications 📋
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Tracking {rows.length} application{rows.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={load}
            disabled={refreshing}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <div className="flex gap-2 rounded-lg border border-slate-200 p-1 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              ≡ Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              ⊞ Table
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {rows.map((app) => (
            <ApplicationCard key={app._id} app={app} />
          ))}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div variants={itemVariants} className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                  Company
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                  Package
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-center font-semibold text-slate-900 dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {app.job?.title || '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {app.job?.company && typeof app.job.company === 'object'
                      ? app.job.company.name
                      : '-'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {app.job?.package || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteApplication(app._id, app.job?.title || 'this job')}
                      className="text-red-600 hover:text-red-700 transition dark:text-red-400 dark:hover:text-red-300"
                      title="Delete application"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Info Footer */}
      <motion.div variants={itemVariants} className="text-xs text-slate-500 dark:text-slate-400">
        ℹ️ Click refresh to see latest updates in real-time
      </motion.div>
    </motion.div>
  )
}
