import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/admin/transactions')({
  component: AdminTransactionsPage,
})

function AdminTransactionsPage() {
  const { transactions, users, updateTransactionStatus } = useBankingStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id

  const filtered = transactions
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .filter(t => statusFilter === 'all' || t.status === statusFilter)

  const totalVolume = filtered.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Transaction Management</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Transactions</div>
            <div className="text-2xl font-bold text-white">{transactions.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Transaction Volume</div>
            <div className="text-2xl font-bold text-white">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-400">{transactions.filter(t => t.status === 'pending').length}</div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Description', 'From', 'To', 'Type', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-700">
                    <td className="px-4 py-3 text-white">{tx.description}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{getUserName(tx.fromUserId)}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{getUserName(tx.toUserId)}</td>
                    <td className="px-4 py-3 text-slate-300 capitalize text-xs">{tx.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-white font-semibold">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tx.status === 'completed' ? 'bg-green-900 text-green-300' :
                        tx.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => updateTransactionStatus(tx.id, 'completed')} className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded hover:bg-green-700">Approve</button>
                          <button onClick={() => updateTransactionStatus(tx.id, 'failed')} className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded hover:bg-red-800">Decline</button>
                        </div>
                      )}
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
