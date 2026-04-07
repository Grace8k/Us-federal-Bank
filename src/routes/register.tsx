import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { PublicLayout } from '@/components/PublicLayout'
import { Eye, EyeOff, Shield } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { register } = useBankingStore()
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', ssnLast4: '', address: '',
    password: '', confirmPassword: '', accountType: 'checking' as 'checking' | 'savings'
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (form.ssnLast4.length !== 4 || !/^\d{4}$/.test(form.ssnLast4)) return setError('SSN last 4 digits must be exactly 4 numbers')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = register({ name: form.name, email: form.email, phone: form.phone, ssnLast4: form.ssnLast4, address: form.address, password: form.password, accountType: form.accountType })
    setLoading(false)
    if (result.success) {
      router.navigate({ to: '/dashboard' })
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
          <div style={{ backgroundColor: '#1e3a5f' }} className="px-8 py-8 text-center">
            <div style={{ backgroundColor: '#c9a227' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">USF</span>
            </div>
            <h1 className="text-white text-2xl font-bold">Open Your Account</h1>
            <p className="text-gray-300 text-sm mt-1">Join 500,000+ customers banking with us</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={set('name')} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="John Smith" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={form.email} onChange={set('email')} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="john@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SSN Last 4 Digits</label>
                  <input type="text" value={form.ssnLast4} onChange={set('ssnLast4')} required maxLength={4} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="1234" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={form.address} onChange={set('address')} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="123 Main St, City, State ZIP" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select value={form.accountType} onChange={set('accountType')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required className="w-full pr-10 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Min 8 characters" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Repeat password" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#c9a227' }}
                className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Open Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <a href="/login" style={{ color: '#1e3a5f' }} className="font-semibold hover:underline">Sign In</a>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={12} /> <span>Your information is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
