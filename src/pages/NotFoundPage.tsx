import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <p className="font-mono text-6xl font-bold text-white/[0.06] mb-4">404</p>
        <h1 className="text-text font-semibold text-lg mb-2">Page not found</h1>
        <p className="text-muted text-sm mb-6">The page you're looking for doesn't exist.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  )
}
