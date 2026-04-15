import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MapPin, Briefcase, DollarSign, Clock, Search, AlertCircle } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { jobApi, applicationApi } from '../../services/api'
import { theme } from '../../config/theme'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const perPage = 6

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await jobApi.getAll()
        setJobs(res.data || [])
        if (!res.data || res.data.length === 0) {
        }
      } catch (error) {
        toast.error('Failed to fetch jobs: ' + (error.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  const filtered = useMemo(() =>
    jobs.filter((j) => {
      const companyName = j.company && typeof j.company === 'object' ? j.company.name : ''
      return `${companyName} ${j.location || ''}`.toLowerCase().includes(search.toLowerCase())
    }),
    [jobs, search]
  )

  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const applyJob = async (jobId) => {
    try {
      await applicationApi.apply({ job: jobId })
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply for job')
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

  const JobCard = ({ job }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(0,0,0,0.15)' }}
      className="card group relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {job.title || 'Job Title'}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            {job.company && typeof job.company === 'object' ? job.company.name : 'Company'}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={16} className="flex-shrink-0" />
            <span>{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign size={16} className="flex-shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {job.package || 'Negotiable'}
            </span>
          </div>
          {job.deadline && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock size={16} className="flex-shrink-0" />
              <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {job.description}
          </p>
        )}

        {/* Requirements / Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(job.skills)
              ? job.skills
              : job.skills.split(',')).slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="badge badge-primary text-xs"
              >
                {skill.trim()}
              </span>
            ))}
            {(Array.isArray(job.skills)
              ? job.skills.length
              : job.skills.split(',').length) > 5 && (
              <span className="text-xs text-slate-500">+ more</span>
            )}
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => applyJob(job._id)}
          className="btn btn-primary w-full group/btn hover:shadow-lg"
        >
          <Briefcase size={16} />
          <span>Apply Now</span>
          <span className="transition-transform group-hover/btn:translate-x-1">→</span>
        </button>
      </div>
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
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job Opportunities 🎯
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {filtered.length} positions available
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 mr-3"
            size={20}
          /> 
          <input
            className="input pl-12"
            placeholder="Search by company or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </motion.div>

      {/* Error state */}
      {!loading && filtered.length === 0 && jobs.length === 0 && (
        <motion.div variants={itemVariants} className="card space-y-3 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
            <p className="font-semibold text-amber-900 dark:text-amber-100">No jobs available yet</p>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Check back later for new opportunities, or update your profile to improve visibility.
          </p>
        </motion.div>
      )}

      {/* Jobs Grid */}
      {paged.length > 0 && (
        <motion.div
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {paged.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </motion.div>
      )}

      {/* Search No Results */}
      {!loading && paged.length === 0 && filtered.length === 0 && jobs.length > 0 && (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No jobs match your search"
            description="Try adjusting your search filters"
          />
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="skeleton h-96 rounded-2xl"
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {paged.length > 0 && (
        <motion.div variants={itemVariants}>
          <Pagination
            page={page}
            setPage={setPage}
            hasNext={page * perPage < filtered.length}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
