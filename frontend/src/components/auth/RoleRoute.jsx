import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RoleRoute({ allowedRoles = [] }) {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  if (!allowedRoles.includes(role)) {
    const fallback = role === 'admin' ? '/admin' : '/student'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
