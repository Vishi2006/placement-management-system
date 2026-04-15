import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, MapPin, Building2, Trash2 } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { interviewApi } from '../../services/api'

const results = ['Pending', 'Passed', 'Failed']

export default function InterviewManagementPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await interviewApi.getAll()
      setRows(res.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch interviews')
      toast.error('Failed to fetch interviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateResult = async (id, result) => {
    try {
      await interviewApi.updateResult(id, { result })
      setRows((prev) => prev.map((row) => (row._id === id ? { ...row, result } : row)))
      toast.success('Result updated successfully')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update result')
    }
  }

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await interviewApi.delete(id)
        setRows((prev) => prev.filter((row) => row._id !== id))
        toast.success('Interview deleted successfully')
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete interview')
      }
    }
  }

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

  const InterviewCard = ({ interview }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate">
              {interview.student?.user?.name || '-'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {interview.student?.user?.email || '-'}
            </p>
          </div>
          <StatusBadge status={interview.result || 'Pending'} />
        </div>

        {/* Interview Details */}
        <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          {/* Company & Job */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Company</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {interview.company?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Position</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {interview.job?.title || '-'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="truncate">
                {interview.date ? new Date(interview.date).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock size={14} className="flex-shrink-0" />
              <span className="truncate">{interview.time || '-'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              {interview.mode === 'Online' ? (
                <Video size={14} className="flex-shrink-0" />
              ) : (
                <Building2 size={14} className="flex-shrink-0" />
              )}
              <span className="truncate">{interview.mode || '-'}</span>
            </div>
            {interview.location && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">{interview.location}</span>
              </div>
            )}
          </div>

          {/* Round */}
          {interview.round && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Round {interview.round}
            </div>
          )}
        </div>

        {/* Result Update */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
          <label className="text-xs text-slate-600 dark:text-slate-400">Update Result</label>
          <select
            className="mt-2 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={interview.result || 'Pending'}
            onChange={(e) => updateResult(interview._id, e.target.value)}
          >
            {results.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => deleteInterview(interview._id)}
          className="btn btn-danger w-full"
        >
          <Trash2 size={16} />
          <span>Delete Interview</span>
        </button>
      </div>
    </motion.div>
  )

  if (loading) return <Loader />

  if (error) return <EmptyState title="Error" description={error} />

  if (rows.length === 0) return <EmptyState title="No interviews scheduled" description="Interviews will appear here once you schedule them." />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Interview Management</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage scheduled interviews ({rows.length})</p>
        </div>
        <button 
          onClick={load}
          className="btn-primary"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Interviews Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {rows.map((interview) => (
          <InterviewCard key={interview._id} interview={interview} />
        ))}
      </motion.div>
    </div>
  )
}
