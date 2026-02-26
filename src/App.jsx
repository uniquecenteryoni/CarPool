import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

function isLoggedIn() {
  return sessionStorage.getItem('adminAuth') === 'true'
}

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        setError(data.error ?? 'Login failed')
        return
      }

      sessionStorage.setItem('adminAuth', 'true')
      navigate('/admin', { replace: true })
    } catch {
      setError('Server is unavailable. Make sure Bun backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Admin Login</h1>
        <p className="hint">Use: admin / 1234</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}

function AdminPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    navigate('/login', { replace: true })
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Admin Panel</h1>
        <p>You are logged in as admin.</p>
        <button onClick={handleLogout}>Logout</button>
      </section>
    </main>
  )
}

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn() ? '/admin' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/admin" replace /> : <LoginPage />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
