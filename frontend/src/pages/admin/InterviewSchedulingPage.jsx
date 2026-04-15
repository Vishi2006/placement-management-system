import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { applicationApi, companyApi, jobApi, interviewApi } from '../../services/api'

export default function InterviewSchedulingPage() {
  const [applications, setApplications] = useState([])
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    student: '',
    company: '',
    job: '',
    date: '',
    time: '',
    mode: 'Online',
  })
  const [filteredJobs, setFilteredJobs] = useState([])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [appsRes, companiesRes, jobsRes] = await Promise.all([
        applicationApi.getAll(),
        companyApi.getAll(),
        jobApi.getAll()
      ])
      
      setApplications(appsRes.data || [])
      setCompanies(companiesRes.data || [])
      setJobs(jobsRes.data || [])
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to load data. Make sure backend is running.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter jobs when company changes
  useEffect(() => {
    if (form.company) {
      const filtered = jobs.filter((j) => j.company && (j.company === form.company || j.company._id === form.company))
      setFilteredJobs(filtered)
      setForm(prev => ({ ...prev, job: '' }))
    } else {
      setFilteredJobs([])
    }
  }, [form.company, jobs])

  const submit = async (event) => {
    event.preventDefault()
    if (!form.student || !form.company || !form.date || !form.time) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      await interviewApi.create({
        student: form.student,
        company: form.company,
        job: form.job || undefined,
        date: form.date,
        time: form.time,
        mode: form.mode,
      })
      toast.success('Interview scheduled successfully')
      setForm({
        student: '',
        company: '',
        job: '',
        date: '',
        time: '',
        mode: 'Online',
      })
      // Reload data
      loadData()
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to schedule interview'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  // Get unique students from applications
  const uniqueStudents = [
    ...new Map(
      applications
        .filter((a) => a.status === 'Shortlisted' || a.status === 'Selected')
        .map((a) => [
          a.student?._id,
          {
            _id: a.student?._id,
            displayName: a.student?.user?.name || 'Unknown',
            displayEmail: a.student?.user?.email || 'N/A'
          }
        ])
        .filter(([id]) => id) // Filter out entries with undefined id
    ).values(),
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader />
        <p className="text-slate-600 dark:text-slate-400 mt-4">Loading interview data...</p>
      </div>
    )
  }

  // Show error state
  if (error && error.includes('backend')) {
    return (
      <EmptyState 
        title="Backend Connection Error" 
        description="Unable to connect to the server. Make sure the backend is running on localhost:5000"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule Interview</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Schedule interviews with shortlisted and selected candidates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="space-y-5">
              {/* Section: Candidate Selection */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Select Candidate</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={form.student}
                    onChange={(e) => setForm({ ...form, student: e.target.value })}
                    required
                  >
                    <option value="">Select a student</option>
                    {uniqueStudents.length > 0 ? (
                      uniqueStudents.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.displayName} - {student.displayEmail}
                        </option>
                      ))
                    ) : (
                      <option disabled>No shortlisted/selected candidates</option>
                    )}
                  </select>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Only showing shortlisted and selected candidates ({uniqueStudents.length})</p>
                </div>
              </div>

              {/* Section: Company & Job */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company & Position</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                    >
                      <option value="">Select company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {companies.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No companies available</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Job Position
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.job}
                      onChange={(e) => setForm({ ...form, job: e.target.value })}
                      disabled={!form.company}
                    >
                      <option value="">Select job (optional)</option>
                      {filteredJobs.map((job) => (
                        <option key={job._id} value={job._id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                    {!form.company && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a company first</p>}
                  </div>
                </div>
              </div>

              {/* Section: Interview Details */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Interview Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section: Mode */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Interview Mode</h3>
                
                <div className="flex gap-4">
                  {['Online', 'Offline'].map((mode) => (
                    <label key={mode} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        value={mode}
                        checked={form.mode === mode}
                        onChange={(e) => setForm({ ...form, mode: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-600"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition mt-6"
              >
                {submitting ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Summary Stats */}
        <div className="space-y-4">
          {/* Available Candidates */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Available Candidates</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{uniqueStudents.length}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Companies</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{companies.length}</p>
              </div>
              <div className="text-3xl">🏢</div>
            </div>
          </div>

          {/* Open Jobs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Open Jobs</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{jobs.length}</p>
              </div>
              <div className="text-3xl">💼</div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Tips</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
              <li>✓ Only shortlisted/selected candidates appear</li>
              <li>✓ Job selection is optional</li>
              <li>✓ Choose interview mode (Online/Offline)</li>
              <li>✓ Confirm date and time before scheduling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
