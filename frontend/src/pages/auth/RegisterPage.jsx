import { motion as Motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react'
import ThemeToggle from '../../components/common/ThemeToggle'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Only students can register
    phone: '',
    branch: '',
    cgpa: '',
    skills: '',
    github: '',
    profilePhoto: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all required fields')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (form.role === 'student' && (!form.phone || !form.branch || !form.cgpa)) {
      toast.error('Phone, branch and CGPA are required for student registration')
      return
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    }

    if (form.role === 'student') {
      payload.phone = form.phone
      payload.branch = form.branch
      payload.cgpa = form.cgpa
      payload.skills = form.skills
      payload.github = form.github
      payload.profilePhoto = form.profilePhoto
    }

    try {
      setLoading(true)
      await register(payload)
      toast.success('Registration successful')
      navigate(form.role === 'admin' ? '/admin' : '/student', { replace: true })
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <Motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden md:flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PMS Pro</h1>
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">Join the Platform</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Register as student or admin to begin.</p>
          </div>
        </Motion.div>

        <Motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6 border border-white dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h2>
              <p className="text-slate-600 dark:text-slate-400">Join our placement platform today</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Type</p>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-center font-medium text-blue-700 dark:text-blue-300">
                  Student Account
                </div>
              </div>

              <div className="relative"><User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" /><input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" /></div>
              <div className="relative"><Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" /><input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" /></div>

              <div className="relative"><Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" /><input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>

              <div className="relative"><Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" /><input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-slate-400">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>

              {form.role === 'student' && (
                <>
                  <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" />
                  <input type="text" placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" />
                  <input type="number" step="0.01" min="0" max="10" placeholder="CGPA" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" />
                  <input type="text" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" />
                  <input type="url" placeholder="GitHub URL (optional)" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors" />
                </>
              )}

              <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6">
                {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight className="w-5 h-5" /></>}
              </Motion.button>
            </form>

            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">Sign in</Link></p>
            </div>
          </div>
        </Motion.div>
      </div>
    </div>
  )
}
