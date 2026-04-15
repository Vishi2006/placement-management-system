import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { BarChart3, Building2, Users, Award, TrendingUp, CheckCircle, Clock, AlertCircle, Lock } from 'lucide-react'
import { applicationApi, companyApi, jobApi } from '../../services/api'
import { theme } from '../../config/theme'
import ChangePassword from '../../components/admin/ChangePassword'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ students: 0, companies: 0, jobs: 0, selected: 0, pending: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [companiesRes, jobsRes, appsRes] = await Promise.all([
          companyApi.getAll(),
          jobApi.getAll(),
          applicationApi.getAll()
        ])
        
        const list = appsRes.data || []
        const companies = companiesRes.data || []
        const jobs = jobsRes.data || []
        
        setStats({
          students: list.length,
          companies: companies.length,
          jobs: jobs.length,
          selected: list.filter((a) => a.status === 'Selected').length,
          pending: list.filter((a) => a.status === 'Pending').length,
          rejected: list.filter((a) => a.status === 'Rejected').length,
        })
      } catch (error) {
        toast.error('Failed to load dashboard statistics')
        setLoading(false)
      }
    }
    load()
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
      className="group card-interactive relative overflow-hidden p-6"
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

  const ActionCard = ({ icon: Icon, title, description, onClick, color }) => (
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Dashboard 📊
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor and manage placement activities</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition duration-200"
        >
          <Lock size={18} />
          Change Password
        </motion.button>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          title="Total Applications"
          value={stats.students}
          color={theme.primary.DEFAULT}
          subtitle="Pending review"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          icon={Building2}
          title="Companies"
          value={stats.companies}
          color={theme.secondary.DEFAULT}
          subtitle="Registered"
          onClick={() => navigate('/admin/companies')}
        />
        <StatCard
          icon={BarChart3}
          title="Total Jobs"
          value={stats.jobs}
          color="#F97316"
          subtitle="Available"
          onClick={() => navigate('/admin/jobs')}
        />
        <StatCard
          icon={Award}
          title="Selected"
          value={stats.selected}
          color={theme.accent}
          subtitle="Placed candidates"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={stats.pending}
          color="#3B82F6"
          subtitle="Under review"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          icon={AlertCircle}
          title="Rejected"
          value={stats.rejected}
          color="#EF4444"
          subtitle="Not selected"
          onClick={() => navigate('/admin/applications')}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Management</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            icon={Users}
            title="Applications"
            description="Review and manage student applications"
            onClick={() => navigate('/admin/applications')}
            color={theme.primary.DEFAULT}
          />
          <ActionCard
            icon={Building2}
            title="Companies"
            description="Add and manage company profiles"
            onClick={() => navigate('/admin/companies')}
            color={theme.secondary.DEFAULT}
          />
          <ActionCard
            icon={BarChart3}
            title="Jobs"
            description="Create and manage job postings"
            onClick={() => navigate('/admin/jobs')}
            color="#F97316"
          />
          <ActionCard
            icon={CheckCircle}
            title="Interviews"
            description="Schedule and manage interviews"
            onClick={() => navigate('/admin/interviews')}
            color={theme.accent}
          />
          <ActionCard
            icon={Clock}
            title="Interview Schedule"
            description="View and organize interview timeline"
            onClick={() => navigate('/admin/schedule')}
            color="#3B82F6"
          />
          <ActionCard
            icon={TrendingUp}
            title="Reports"
            description="Generate placement reports & analytics"
            onClick={() => navigate('/admin/applications')}
            color="#8B5CF6"
          />
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div variants={itemVariants} className="card space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">📈 Placement Summary</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Success Rate</p>
            <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">
              {stats.students > 0 ? Math.round((stats.selected / stats.students) * 100) : 0}%
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Avg Applications</p>
            <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
              {stats.jobs > 0 ? Math.round(stats.students / stats.jobs) : 0}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Jobs Per Company</p>
            <p className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">
              {stats.companies > 0 ? Math.round(stats.jobs / stats.companies) : 0}
            </p>
          </div>
        </div>
      </motion.div>

    {/* Password Change Modal */}
    {showPasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-gray-800"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            <ChangePassword
              onSuccess={() => {
                setShowPasswordModal(false)
                toast.success('Password changed successfully!')
              }}
            />
          </div>
        </motion.div>
      </div>
    )}
    </motion.div>
  )
} 
