import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Calendar, Clock, Video, MapPin, Building2, AlertCircle, RefreshCw } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import { interviewApi } from '../../services/api'
import { theme } from '../../config/theme'

export default function InterviewsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      setRefreshing(true)
      const res = await interviewApi.myInterviews()
      setItems(res.data || [])
    } catch (error) {
      toast.error('Failed to fetch interviews')
    } finally {
      setLoading(false)
      setRefreshing(false)
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

  const isUpcoming = (date) => new Date(date) > new Date()
  const isPast = (date) => new Date(date) < new Date()

  const InterviewCard = ({ interview }) => {
    const isPastInterview = isPast(interview.date)
    const isUpcomingInterview = isUpcoming(interview.date)

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8 }}
        className="card group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Status Badge */}
        <div className="absolute right-6 top-6 z-20">
          <StatusBadge status={interview.result || 'Pending'} />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="pr-20">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {interview.company?.name || 'Company'}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              {interview.job?.title || 'Position'}
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-400">Date</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {interview.date ? new Date(interview.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }) : 'TBD'}
                </p>
              </div>
              {isUpcomingInterview && (
                <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
                  Upcoming
                </span>
              )}
              {isPastInterview && (
                <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  Completed
                </span>
              )}
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Clock size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-400">Time</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {interview.time || 'Not scheduled'}
                </p>
              </div>
            </div>

            {/* Mode */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                {interview.mode === 'Online' ? (
                  <Video size={18} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-400">Interview Mode</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {interview.mode || 'TBD'}
                </p>
              </div>
            </div>

            {/* Location/Link */}
            {interview.location && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <MapPin size={18} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {interview.location}
                  </p>
                </div>
              </div>
            )}

            {/* Round Info */}
            {interview.round && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <AlertCircle size={16} className="flex-shrink-0 text-slate-600 dark:text-slate-400" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Round {interview.round}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {interview.notes && (
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Notes</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {interview.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) return <Loader />

  if (!items.length)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <EmptyState
          title="No interviews scheduled"
          description="You will see interview details here once scheduled by companies."
        />
      </motion.div>
    )

  const upcomingInterviews = items.filter((i) => isUpcoming(i.date))
  const pastInterviews = items.filter((i) => isPast(i.date))

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Interviews 📅
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {items.length} interview{items.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </motion.div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Upcoming Interviews
            </h2>
            <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              {upcomingInterviews.length}
            </span>
          </div>
          <motion.div
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-2"
          >
            {upcomingInterviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Completed Interviews
            </h2>
            <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {pastInterviews.length}
            </span>
          </div>
          <motion.div
            variants={containerVariants}
            className="grid gap-6 opacity-75 md:grid-cols-2"
          >
            {pastInterviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
