import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  FileText,
  Download,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'

function normalizeResumeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return ''

  let normalized = rawUrl.trim()
  normalized = normalized.replace(/\s/g, '%20')

  return normalized
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [resumeUrl, setResumeUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('pms_token')
        const response = await fetch('http://localhost:5000/api/students/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setResumeUrl(normalizeResumeUrl(data?.resume || data?.url || data?.resumeUrl || ''))
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [])

  const uploadResume = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and Word documents (DOC, DOCX) are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)

    setUploading(true)
    const toastId = toast.loading(`Uploading ${file.name}...`)

    try {
      const response = await fetch('http://localhost:5000/api/students/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('pms_token')}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.message || 'Failed to upload resume')
      }

      const data = await response.json()
      const uploadedUrl = normalizeResumeUrl(data?.resume || data?.url || data?.resumeUrl || '')
      if (!uploadedUrl) {
        throw new Error('Resume uploaded, but response URL is missing')
      }
      setResumeUrl(uploadedUrl)
      toast.success('Resume uploaded successfully! 🎉', { id: toastId })
    } catch (error) {
      const errorMsg = error?.message || 'Failed to upload resume'
      toast.error(errorMsg, { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const deleteResume = async () => {
    if (!window.confirm('Delete your resume? This action cannot be undone.')) return

    const toastId = toast.loading('Deleting resume...')
    try {
      const token = localStorage.getItem('pms_token')
      const response = await fetch('http://localhost:5000/api/students/resume', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setResumeUrl('')
        toast.success('Resume deleted successfully', { id: toastId })
      } else {
        toast.error('Failed to delete resume', { id: toastId })
      }
    } catch (error) {
      toast.error('Error deleting resume', { id: toastId })
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

  if (loading) return <Loader />

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
          Your Profile 👤
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your profile information and documents</p>
      </motion.div>

      {/* Basic Info Card */}
      <motion.div variants={itemVariants} className="card group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your account details</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <User size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Full Name</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {user?.name || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email Address</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Account Role</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resume Card */}
      <motion.div variants={itemVariants} className="card group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resume/CV</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Upload your latest resume for companies to review</p>
          </div>

          {/* Upload Area */}
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 transition hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={uploadResume}
              disabled={uploading || loading}
              className="sr-only"
              id="resume-input"
            />
            <label
              htmlFor="resume-input"
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                <Upload size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  PDF, DOC or DOCX (max 5MB)
                </p>
              </div>
            </label>
          </div>

          {/* Current Resume */}
          {!uploading && resumeUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-lg bg-green-50 p-4 dark:bg-green-950"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <FileText size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-200">Resume uploaded</p>
                  <p className="mt-0.5 text-xs text-green-600 dark:text-green-300">
                    Companies can view your resume
                  </p>
                </div>
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>

              <div className="flex gap-3">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex-1"
                >
                  <Download size={16} />
                  <span>View Resume</span>
                </a>
                <button
                  onClick={deleteResume}
                  className="btn btn-danger flex-1"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}

          {!uploading && !resumeUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-950"
            >
              <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">No resume uploaded</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Upload a resume to improve your chances of getting selected
                </p>
              </div>
            </motion.div>
          )}

          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Uploading your resume...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tips Card */}
      <motion.div variants={itemVariants} className="card space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">💡 Profile Tips</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            Keep your resume updated with latest skills and experience
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            Use a professional format and clear, readable fonts
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
            Include all relevant certifications and achievements
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            Proofread for grammar and spelling errors
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
