import { Briefcase, Building2, CalendarClock, Home, Menu, User, X, LayoutDashboard } from 'lucide-react'
import { motion as Motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const iconByLabel = {
  Overview: LayoutDashboard,
  Dashboard: LayoutDashboard,
  Jobs: Briefcase,
  Applications: Briefcase,
  Interviews: CalendarClock,
  Schedule: CalendarClock,
  Profile: User,
  Companies: Building2,
  Students: User,
}

export default function Sidebar({ menu, collapsed, setCollapsed }) {
  const containerVariants = {
    open: {
      width: 248,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      width: 88,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  }

  return (
    <Motion.aside
      variants={containerVariants}
      initial={collapsed ? 'closed' : 'open'}
      animate={collapsed ? 'closed' : 'open'}
      className="fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:relative md:border-r md:border-slate-200 md:shadow-none"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-6 dark:border-slate-800">
          <Motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                P
              </div>
              <span className="font-bold text-slate-900 dark:text-white">PMS Pro</span>
            </div>
          </Motion.div>

          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menu.map((item) => {
            const Icon = iconByLabel[item.label] || Home
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className="flex-shrink-0" />
                    <Motion.span
                      initial={false}
                      animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </Motion.span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 h-6 w-1 rounded-l-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Placement Management System
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              v1.0.0
            </p>
          </Motion.div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!collapsed && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}
    </Motion.aside>
  )
}
