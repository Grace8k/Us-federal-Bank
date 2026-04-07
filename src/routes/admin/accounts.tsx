import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/admin/accounts')({
  component: AdminAccountsPage,
})

function AdminAccountsPage() {
  const { users } = useBankingStore()
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.accountNumber.includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalBalance = users.reduce((s, u) => s + u.balance, 0)
  const checking = users.filter(u => u.accountType === 'checking').length
  const savings = users.filter(u => u.accountType === 'savings').length

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Account Management</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Accounts</div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Deposits</div>
            <div className="text-2xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Checking / Savings</div>
            <div className="text-2xl font-bold text-white">{checking} / {savings}</div>
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none text-sm" />
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Account Holder', 'Account Number', 'Type', 'Balance', 'KYC', 'Status', 'Opened'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-slate-700">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-slate-400 text-xs">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{user.accountNumber}</td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{user.accountType}</td>
                    <td className="px-4 py-3 text-white font-semibold">${user.balance.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${user.kycStatus === 'verified' ? 'bg-green-900 text-green-300' : user.kycStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>{user.kycStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
