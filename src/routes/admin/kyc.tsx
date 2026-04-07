import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { CheckCircle, XCircle } from 'lucide-react'

const ADMIN_EMAIL = 'admin@unitedstatebank.com'

export const Route = createFileRoute('/admin/kyc')({
  component: AdminKycPage,
})

function AdminKycPage() {
  const { users, adminUpdateUser } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const pending = users.filter(u => u.kycStatus === 'pending')
  const verified = users.filter(u => u.kycStatus === 'verified')
  const rejected = users.filter(u => u.kycStatus === 'rejected')

  const updateKyc = (userId: string, status: 'verified' | 'rejected') => {
    adminUpdateUser(userId, { kycStatus: status }, ADMIN_EMAIL)
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">KYC Verification</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-yellow-700">
            <div className="text-yellow-400 text-xs mb-1">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-400">{pending.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-green-700">
            <div className="text-green-400 text-xs mb-1">Verified</div>
            <div className="text-3xl font-bold text-green-400">{verified.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-red-700">
            <div className="text-red-400 text-xs mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-400">{rejected.length}</div>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="mb-6">
            <h3 className="text-yellow-400 font-semibold mb-3">Pending KYC Reviews</h3>
            <div className="space-y-3">
              {pending.map(user => (
                <div key={user.id} className="bg-slate-800 border border-yellow-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">{user.name}</div>
                    <div className="text-slate-400 text-sm">{user.email} · {user.phone}</div>
                    <div className="text-slate-500 text-xs">{user.address}</div>
                    <div className="text-slate-500 text-xs">SSN Last 4: {user.ssnLast4} · Account: {user.accountNumber}</div>
                    <div className="text-slate-500 text-xs">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateKyc(user.id, 'verified')} className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-600">
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button onClick={() => updateKyc(user.id, 'rejected')} className="flex items-center gap-1 px-4 py-2 bg-red-700 text-white rounded-lg text-sm hover:bg-red-600">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-semibold">All KYC Records</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {['Name', 'Email', 'Account', 'SSN Last 4', 'KYC Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-700">
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{user.accountNumber}</td>
                  <td className="px-4 py-3 text-slate-300">****{user.ssnLast4}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${user.kycStatus === 'verified' ? 'bg-green-900 text-green-300' : user.kycStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.kycStatus !== 'verified' && (
                        <button onClick={() => updateKyc(user.id, 'verified')} className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded hover:bg-green-800">Verify</button>
                      )}
                      {user.kycStatus !== 'rejected' && (
                        <button onClick={() => updateKyc(user.id, 'rejected')} className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded hover:bg-red-800">Reject</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
