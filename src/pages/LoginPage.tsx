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

const DEMO_ACCOUNTS = [
  { label: 'admin', email: 'admin@demo.com', password: '1234' },
  { label: 'superadmin', email: 'superadmin@demo.com', password: 'super1234' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
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

  function fillDemo(email: string, password: string) {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
  }

  return (
    <div className="w-full max-w-sm animate-fadeIn">
      <div className="card p-6 sm:p-8 shadow-elev-3">
        <div className="flex items-center gap-2.5 mb-7">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="url(#loginGrad)" />
            <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="10" r="2" fill="white" />
            <defs>
              <linearGradient id="loginGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-semibold text-text text-[15px]">Commerce Admin</span>
        </div>

        <h1 className="text-xl font-semibold text-text mb-1 tracking-tight">Sign in</h1>
        <p className="text-muted text-sm mb-3">Enter your credentials to continue</p>

        {/* Demo account hints */}
        <div className="rounded-lg border border-border bg-surface-offset p-3 mb-5 space-y-1.5">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-2">Demo access</p>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillDemo(acc.email, acc.password)}
              className="w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs hover:bg-surface-dynamic transition-colors group"
            >
              <span className="font-mono text-text/70 group-hover:text-text transition-colors">
                {acc.email}
              </span>
              <span className="font-mono text-muted/50 group-hover:text-muted transition-colors">
                {acc.password}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
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
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full justify-center mt-2 py-2.5"
          >
            {mutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-muted mt-6">
        E-Commerce admin dashboard · Protected area
      </p>
    </div>
  )
}
