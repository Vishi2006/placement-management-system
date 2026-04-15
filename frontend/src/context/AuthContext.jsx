import { useCallback, useMemo, useState } from 'react'
import { loginUser, registerUser, logoutUser, getCurrentUser, getAuthToken } from '../services/authService'
import { AuthContext } from './AuthContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return getCurrentUser()
  })
  const [token, setToken] = useState(() => {
    return getAuthToken()
  })
  const [loading] = useState(false)

  const persistSession = (responseData) => {
    const authToken = responseData?.token
    const authUser = responseData?.user

    if (authToken && authUser) {
      setToken(authToken)
      setUser(authUser)
    }
  }

  const login = useCallback(async (payload) => {
    try {
      const response = await loginUser(payload)
      persistSession(response)
      return response
    } catch (error) {
      throw error
    }
  }, [])

  const register = useCallback(async (payload) => {
    try {
      const response = await registerUser(payload)
      persistSession(response)
      return response
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    logoutUser()
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
