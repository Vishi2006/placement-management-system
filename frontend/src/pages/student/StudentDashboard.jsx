import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Briefcase, Calendar, Award, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import { applicationApi, interviewApi } from '../../services/api'
import { theme } from '../../config/theme'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ applied: 0, interviews: 0, selected: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [appsRes, interviewsRes] = await Promise.all([
          applicationApi.myApplications(),
          interviewApi.myInterviews(),
        ])

        const applications = (appsRes.data) || []
        const interviews = (interviewsRes.data) || []
        
        setStats({
          applied: applications.length,
          interviews: interviews.length,
          selected: applications.filter((a) => a.status === 'Selected').length,
          pending: applications.filter((a) => a.status === 'Pending').length,
        })
      } catch (error) {
        toast.error('Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const StatCard = ({ icon: Icon, title, value, color, onClick, subtitle }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group card-interactive relative overflow-hidden bg-gradient-to-br p-6"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${color}15, ${color}05)`,
      }}
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: color }} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-4xl font-bold" style={{ color }}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{subtitle}</p>}
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-interactive group relative w-full overflow-hidden text-left"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <Icon size={24} className="flex-shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
      </div>
    </motion.button>
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome Back, Student! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Here's your placement journey at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          title="Applications"
          value={stats.applied}
          color={theme.primary.DEFAULT}
          subtitle={`${stats.pending} pending`}
          onClick={() => navigate('/student/applications')}
        />
        <StatCard
          icon={Calendar}
          title="Interviews"
          value={stats.interviews}
          color={theme.secondary.DEFAULT}
          subtitle="Scheduled"
          onClick={() => navigate('/student/interviews')}
        />
        <StatCard
          icon={Award}
          title="Selected"
          value={stats.selected}
          color={theme.accent}
          subtitle="Offers received"
          onClick={() => navigate('/student/applications')}
        />
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value={stats.applied > 0 ? Math.round((stats.selected / stats.applied) * 100) : 0}
          color="#F97316"
          subtitle="%"
          onClick={() => navigate('/student/applications')}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            icon={Briefcase}
            title="Browse Jobs"
            description="Find and apply to new opportunities"
            onClick={() => navigate('/student/jobs')}
            color={theme.primary.DEFAULT}
          />
          <QuickActionCard
            icon={Calendar}
            title="View Interviews"
            description="Check your scheduled interviews"
            onClick={() => navigate('/student/interviews')}
            color={theme.secondary.DEFAULT}
          />
          <QuickActionCard
            icon={Briefcase}
            title="My Applications"
            description="Track your application status"
            onClick={() => navigate('/student/applications')}
            color={theme.primary.DEFAULT}
          />
          <QuickActionCard
            icon={Clock}
            title="Update Profile"
            description="Keep your profile up to date"
            onClick={() => navigate('/student/profile')}
            color={theme.accent}
          />
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div variants={itemVariants} className="card space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">💡 Placement Tips</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            Keep your profile and resume updated to increase visibility to companies
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
            Apply to multiple companies to maximize your chances of placement
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
            Be prepared for interviews and attend all scheduled interviews
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
