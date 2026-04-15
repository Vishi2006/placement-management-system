import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Calendar, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { applicationApi } from '../../services/api'

const statuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected']

export default function ApplicationsManagementPage() {
  const [apps, setApps] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const load = async () => {
    try {
      setRefreshing(true)
      const res = await applicationApi.getAll()
      setApps(res.data || [])
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch applications')
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const downloadAllApplications = async () => {
    try {
      setDownloading(true)
      const response = await applicationApi.exportAllExcel()
      
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `all_applications_${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Downloaded all applications')
    } catch (err) {
      toast.error('Failed to download applications')
    } finally {
      setDownloading(false)
    }
  }

  const downloadCompanyApplications = async (companyId, companyName) => {
    try {
      setDownloading(true)
      const response = await applicationApi.exportCompanyExcel(companyId)
      
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${companyName}_applications_${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Downloaded ${companyName} applications`)
    } catch (err) {
      toast.error('Failed to download applications')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await applicationApi.updateStatus(id, { status })
      toast.success('Status updated')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  const deleteApplication = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}'s application? This action cannot be undone.`)) {
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

  const rows = filter === 'All' ? apps : apps.filter((a) => a.status === filter)
  
  const companies = [...new Set(apps.map(a => a.job?.company?._id))].map(id => {
    const app = apps.find(a => a.job?.company?._id === id)
    return { id, name: app?.job?.company?.name }
  }).filter(c => c.id)

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

  const ApplicationCard = ({ app }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate">
              {app.student?.user?.name || '-'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {app.student?.user?.email || '-'}
            </p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        {/* Job Details */}
        <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Position</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {app.job?.title || '-'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{app.job?.company?.name || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="flex-shrink-0" />
            <span>{app.job?.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign size={14} className="flex-shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{app.job?.package || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar size={14} className="flex-shrink-0" />
            <span>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-')}</span>
          </div>
        </div>

        {/* Status Update */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
          <label className="text-xs text-slate-600 dark:text-slate-400">Update Status</label>
          <select
            className="mt-2 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={app.status}
            onChange={(e) => updateStatus(app._id, e.target.value)}
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => deleteApplication(app._id, app.student?.user?.name || 'Student')}
          className="btn btn-danger w-full"
        >
          <Trash2 size={16} />
          <span>Delete Application</span>
        </button>
      </div>
    </motion.div>
  )

  if (loading) return <Loader />

  if (error) return <EmptyState title="Error" description={error} />

  if (apps.length === 0) return <EmptyState title="No applications yet" description="Applications will appear here once students apply for jobs." />

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applications Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Review and update student applications ({apps.length})</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <button 
              onClick={load}
              disabled={refreshing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {refreshing ? '⟳ Refreshing...' : '🔄 Refresh'}
            </button>
            <button 
              onClick={downloadAllApplications}
              disabled={downloading || apps.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              {downloading ? '⬇️ Downloading...' : '📊 Download Excel Report'}
            </button>
            {companies.length > 0 && (
              <div className="relative group">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap">
                  📥 Download by Company Wise
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-10">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => downloadCompanyApplications(company.id, company.name)}
                      disabled={downloading}
                      className="block w-full text-left px-4 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-50"
                    >
                      📄 {company.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <select 
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {rows.map((app) => (
          <ApplicationCard key={app._id} app={app} />
        ))}
      </motion.div>

      <div className="text-xs text-slate-500 dark:text-slate-400 py-2">
        ℹ️ Showing {rows.length} of {apps.length} applications | Click refresh to reload data
      </div>
    </div>
  )
}

