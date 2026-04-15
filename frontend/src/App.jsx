import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ApplicationsManagementPage from './pages/admin/ApplicationsManagementPage'
import CompaniesPage from './pages/admin/CompaniesPage'
import InterviewManagementPage from './pages/admin/InterviewManagementPage'
import InterviewSchedulingPage from './pages/admin/InterviewSchedulingPage'
import JobsManagementPage from './pages/admin/JobsManagementPage'
import ApplicationsPage from './pages/student/ApplicationsPage'
import InterviewsPage from './pages/student/InterviewsPage'
import JobsPage from './pages/student/JobsPage'
import ProfilePage from './pages/student/ProfilePage'
import StudentDashboard from './pages/student/StudentDashboard'
import { adminMenu, studentMenu } from './utils/constants'

export default function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('pms_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('pms_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('pms_theme', 'light')
    }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<AppLayout title="Student Dashboard" menu={studentMenu} />}>
            <Route index element={<StudentDashboard />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AppLayout title="Admin Dashboard" menu={adminMenu} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="jobs" element={<JobsManagementPage />} />
            <Route path="applications" element={<ApplicationsManagementPage />} />
            <Route path="schedule" element={<InterviewSchedulingPage />} />
            <Route path="interviews" element={<InterviewManagementPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
