import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Save, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { currentUser, updateProfile } = useBankingStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (currentUser) setForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone, address: currentUser.address })
  }, [currentUser])

  if (!mounted || !currentUser) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(currentUser.id, { name: form.name, phone: form.phone, address: form.address })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>My Profile</h1>

        {/* Profile Card */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2040 100%)' }} className="rounded-2xl p-6 text-white mb-6 flex items-center gap-5">
          <div style={{ backgroundColor: '#c9a227' }} className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">{currentUser.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-blue-200">{currentUser.email}</p>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs ${currentUser.kycStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                KYC: {currentUser.kycStatus}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${currentUser.status === 'active' ? 'bg-blue-500' : 'bg-red-500'}`}>
                {currentUser.status}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Account Number', value: currentUser.accountNumber },
              { label: 'Account Type', value: currentUser.accountType === 'checking' ? 'Checking' : 'Savings' },
              { label: 'Member Since', value: new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
              { label: 'Balance', value: `$${currentUser.balance.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label} className="py-2 border-b border-gray-50">
                <div className="text-gray-500 text-xs">{label}</div>
                <div className="font-semibold text-gray-800">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-green-700">Profile updated successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
              <input type="email" value={form.email} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <button type="submit" style={{ backgroundColor: '#1e3a5f' }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold hover:opacity-90">
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
