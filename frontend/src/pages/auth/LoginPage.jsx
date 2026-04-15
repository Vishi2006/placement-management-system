import { motion as Motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react'
import ThemeToggle from '../../components/common/ThemeToggle'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Email and password are required')
      return
    }

    try {
      setLoading(true)
      const response = await login(form)
      const role = (response?.user?.role || '').toLowerCase()
      const redirect = role === 'admin' ? '/admin' : '/student'
      navigate(location.state?.from?.pathname || redirect, { replace: true })
      toast.success('Welcome back!')
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
        />
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Branding */}
        <Motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-center space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PMS Pro</h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Welcome to Your Career Gateway
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Connect with top companies, manage your placements, and build your future with ease.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: '🎯', text: 'Smart Job Matching' },
              { icon: '📊', text: 'Real-time Tracking' },
              { icon: '🤝', text: 'Direct HR Access' }
            ].map((item, idx) => (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* Right side - Login Form */}
        <Motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 sm:p-10 space-y-6 border border-white dark:border-slate-700">
            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sign in</h2>
              <p className="text-slate-600 dark:text-slate-400">Enter your credentials to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Input */}
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors"
                  />
                </div>
              </Motion.div>

              {/* Password Input */}
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:text-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </Motion.div>

              {/* Login Button */}
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Motion.button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  Create one
                </Link>
              </p>
            </Motion.div>
          </div>

          {/* Demo hint */}
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-semibold">Demo credentials:</span> Use your registered email and password to log in.
            </p>
          </Motion.div>
        </Motion.div>
      </div>
    </div>
  )
}


