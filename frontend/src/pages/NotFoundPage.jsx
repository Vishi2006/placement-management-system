import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home, ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 opacity-20 rounded-full blur-2xl"></div>
            <AlertCircle className="w-24 h-24 text-red-500 relative" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-2">404</h1>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          Page Not Found
        </h2>

        {/* Error Message */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Sorry! The page you're looking for doesn't exist. This might happen if you:
        </p>

        {/* Reasons List */}
        <ul className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8 text-left">
          <li className="flex items-start gap-2 mb-3 text-slate-700 dark:text-slate-300">
            <span className="text-red-500 font-bold mt-1">•</span>
            <span>Accessed an invalid URL</span>
          </li>
          <li className="flex items-start gap-2 mb-3 text-slate-700 dark:text-slate-300">
            <span className="text-red-500 font-bold mt-1">•</span>
            <span>Refreshed the page after copying the link</span>
          </li>
          <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
            <span className="text-red-500 font-bold mt-1">•</span>
            <span>Followed an outdated bookmark</span>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Login Page
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>

        {/* Support Message */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}
