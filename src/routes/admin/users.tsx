import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Search, DollarSign, Lock, Unlock } from 'lucide-react'

const ADMIN_EMAIL = 'admin@unitedstatebank.com'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const { users, adminUpdateUser, adminAddFunds, adminDeductFunds } = useBankingStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [fundAmt, setFundAmt] = useState('')
  const [action, setAction] = useState<'add' | 'deduct'>('add')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.accountNumber.includes(search)
  )

  const selectedUser = users.find(u => u.id === selected)

  const handleFunds = () => {
    if (!selected || !fundAmt) return
    const amt = parseFloat(fundAmt)
    if (action === 'add') adminAddFunds(selected, amt, ADMIN_EMAIL)
    else adminDeductFunds(selected, amt, ADMIN_EMAIL)
    setFundAmt('')
    setSelected(null)
  }

  const toggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    adminUpdateUser(userId, { status: newStatus as 'active' | 'suspended' }, ADMIN_EMAIL)
  }

  const updateKyc = (userId: string, kycStatus: 'verified' | 'rejected' | 'pending') => {
    adminUpdateUser(userId, { kycStatus }, ADMIN_EMAIL)
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or account number..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>

        {selected && selectedUser && (
          <div className="bg-slate-800 border border-yellow-500 rounded-xl p-5 mb-4">
            <h3 className="text-white font-semibold mb-3">Manage: {selectedUser.name}</h3>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex gap-2">
                <button onClick={() => setAction('add')} className={`px-3 py-2 rounded text-sm ${action === 'add' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Add Funds</button>
                <button onClick={() => setAction('deduct')} className={`px-3 py-2 rounded text-sm ${action === 'deduct' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Deduct Funds</button>
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" value={fundAmt} onChange={e => setFundAmt(e.target.value)} placeholder="Amount"
                  className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none" />
                <button onClick={handleFunds} style={{ backgroundColor: '#c9a227' }} className="px-4 py-2 rounded text-white text-sm font-semibold">
                  <DollarSign size={14} className="inline mr-1" /> Apply
                </button>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => updateKyc(selected, 'verified')} className="px-3 py-2 bg-green-700 text-white rounded text-xs">Verify KYC</button>
                <button onClick={() => updateKyc(selected, 'rejected')} className="px-3 py-2 bg-red-700 text-white rounded text-xs">Reject KYC</button>
                <button onClick={() => setSelected(null)} className="px-3 py-2 bg-slate-600 text-white rounded text-xs">Close</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Name', 'Email', 'Account #', 'Balance', 'KYC', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-slate-300">{user.email}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{user.accountNumber}</td>
                    <td className="px-4 py-3 text-white font-semibold">${user.balance.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select value={user.kycStatus} onChange={e => updateKyc(user.id, e.target.value as 'verified' | 'rejected' | 'pending')}
                        className={`text-xs px-2 py-1 rounded border-0 focus:outline-none ${user.kycStatus === 'verified' ? 'bg-green-900 text-green-300' : user.kycStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(user.id === selected ? null : user.id)} className="text-yellow-400 hover:text-yellow-300 text-xs">
                          <DollarSign size={15} />
                        </button>
                        <button onClick={() => toggleStatus(user.id, user.status)} className={user.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}>
                          {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                      </div>
                    </td>
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
