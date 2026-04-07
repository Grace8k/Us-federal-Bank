import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { PublicLayout } from '@/components/PublicLayout'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, currentUser } = useBankingStore()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) router.navigate({ to: '/dashboard' })
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn')
    if (adminLoggedIn) router.navigate({ to: '/admin' })
  }, [currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      if (result.role === 'admin') {
        sessionStorage.setItem('adminLoggedIn', 'true')
        router.navigate({ to: '/admin' })
      } else {
        router.navigate({ to: '/dashboard' })
      }
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div style={{ backgroundColor: '#1e3a5f' }} className="px-8 py-8 text-center">
            <div style={{ backgroundColor: '#c9a227' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">USF</span>
            </div>
            <h1 className="text-white text-2xl font-bold">Online Banking</h1>
            <p className="text-gray-300 text-sm mt-1">Sign in to your account securely</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Your password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#1e3a5f' }}
                className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <a href="/register" style={{ color: '#c9a227' }} className="font-semibold hover:underline">Open Account</a>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Demo Credentials:</p>
              <p>Customer: testuser@email.com / TestUser@123</p>
              <p>Admin: admin@unitedstatebank.com / USBank@Admin2024#</p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={12} /> <span>256-bit SSL Encrypted · FDIC Insured</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
