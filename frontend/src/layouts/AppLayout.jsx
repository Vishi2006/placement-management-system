import { LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/common/Sidebar'
import ThemeToggle from '../components/common/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export default function AppLayout({ menu, title }) {
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      {/* Sidebar */}
      <Sidebar menu={menu} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              >
                {collapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Placement System
                </p>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileOpen(!profileOpen)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {user?.role || 'User'}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                  >
                    {/* Profile Info */}
                    <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 p-2">
                      {user?.role === 'student' && (
                        <>
                          <button
                            onClick={() => {
                              navigate('/student/profile')
                              setProfileOpen(false)
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate('/student/profile')
                              setProfileOpen(false)
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            Update Resume
                          </button>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-200 p-2 dark:border-slate-700">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
