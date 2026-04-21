import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg bg-grid flex items-center justify-center px-4">
      <div className="text-center animate-fadeIn max-w-md">
        <p className="font-mono text-[96px] sm:text-[128px] font-bold leading-none bg-gradient-to-b from-white/[0.12] to-white/[0.02] bg-clip-text text-transparent mb-2 select-none">
          404
        </p>
        <h1 className="text-text font-semibold text-xl mb-2 tracking-tight">Page not found</h1>
        <p className="text-muted text-sm mb-7">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 justify-center">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
