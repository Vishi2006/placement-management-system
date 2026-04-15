import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    // Read from localStorage or system preference
    const saved = localStorage.getItem('pms_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Sync theme with DOM whenever dark state changes
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('pms_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('pms_theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => {
    setDark(prev => !prev)
  }

  return (
    <Motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? (
          <Sun size={18} className="text-yellow-500" />
        ) : (
          <Moon size={18} className="text-slate-700" />
        )}
      </Motion.div>
    </Motion.button>
  )
}

