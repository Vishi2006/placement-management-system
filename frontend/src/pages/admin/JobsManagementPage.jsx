import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, DollarSign, Trash2, Edit2 } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import { companyApi, jobApi } from '../../services/api'

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({
    title: '',
    company: '',
    package: '',
    location: '',
    skills: '',
    description: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const loadData = () => {
    jobApi.getAll().then((res) => setJobs(res.data || []))
    companyApi.getAll().then((res) => setCompanies(res.data || []))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.company.trim()) {
      toast.error('Job title and company are required')
      return
    }

    try {
      const payload = {
        title: form.title,
        company: form.company,
        package: form.package ? Number(form.package) : undefined,
        location: form.location,
        description: form.description,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
      }

      if (editingId) {
        await jobApi.update(editingId, payload)
        toast.success('Job updated successfully')
      } else {
        await jobApi.create(payload)
        toast.success('Job created successfully')
      }

      setForm({
        title: '',
        company: '',
        package: '',
        location: '',
        skills: '',
        description: '',
      })
      setEditingId(null)
      setIsOpen(false)
      loadData()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save job')
    }
  }

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      company: (job.company && job.company._id) || job.company || '',
      package: job.package || '',
      location: job.location || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      description: job.description || '',
    })
    setEditingId(job._id)
    setIsOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobApi.delete(id)
        toast.success('Job deleted successfully')
        loadData()
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete job')
      }
    }
  }

  const closeModal = () => {
    setForm({
      title: '',
      company: '',
      package: '',
      location: '',
      skills: '',
      description: '',
    })
    setEditingId(null)
    setIsOpen(false)
  }

  const getCompanyName = (companyId) => {
    if (!companyId) return 'Unknown Company'
    const company = companies.find((c) => c._id === companyId)
    return company?.name || 'Unknown Company'
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
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
            {job.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            {job.company && typeof job.company === 'object' ? job.company.name : getCompanyName(job.company)}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="flex-shrink-0" />
            <span>{job.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign size={14} className="flex-shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {job.package || '-'} LPA
            </span>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {job.description}
          </p>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(job.skills)
              ? job.skills
              : job.skills.split(',')).slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="badge badge-primary text-xs"
              >
                {skill.trim()}
              </span>
            ))}
            {(Array.isArray(job.skills)
              ? job.skills.length
              : job.skills.split(',').length) > 3 && (
              <span className="text-xs text-slate-500">+ more</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleEdit(job)}
            className="btn flex-1 btn-primary gap-2"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(job._id)}
            className="btn flex-1 btn-danger gap-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Jobs Management</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage job postings ({jobs.length})</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="btn-primary">
          + Add Job
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass w-full max-w-2xl rounded-2xl border p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Job' : 'Add New Job'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input"
                placeholder="Job Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <select
                className="input"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              >
                <option value="">Select Company *</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                className="input"
                placeholder="Package (in LPA)"
                type="number"
                step="0.1"
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
              />

              <input
                className="input"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                className="input"
                placeholder="Skills (comma-separated, e.g: React, Node.js, MongoDB)"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />

              <textarea
                className="input"
                placeholder="Job Description"
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Create your first job posting to get started."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
