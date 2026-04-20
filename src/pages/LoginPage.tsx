import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data.token, data.refreshToken, data.displayName)
      toast.success(`Welcome back, ${data.displayName}`)
      navigate('/dashboard')
    },
    onError: () => toast.error('Invalid email or password'),
  })

  return (
    <div className="w-full max-w-sm animate-fadeIn">
      <div className="flex items-center gap-2.5 mb-8">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#0ea5e9" />
          <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="10" r="2" fill="white" />
        </svg>
        <span className="font-semibold text-text">Commerce Admin</span>
      </div>

      <h1 className="text-xl font-semibold text-text mb-1">Sign in</h1>
      <p className="text-muted text-sm mb-6">Enter your credentials to continue</p>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            {...register('email')}
            type="email"
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary w-full justify-center mt-2"
        >
          {mutation.isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
            : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
