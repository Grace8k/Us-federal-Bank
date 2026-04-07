import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react'

export const Route = createFileRoute('/dashboard/transactions')({
  component: TransactionsPage,
})

function TransactionsPage() {
  const { currentUser, transactions } = useBankingStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userTxs = transactions
    .filter(t => t.fromUserId === currentUser.id || t.toUserId === currentUser.id)
    .filter(t => {
      if (filter === 'credit') return t.toUserId === currentUser.id
      if (filter === 'debit') return t.fromUserId === currentUser.id
      return true
    })
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Transaction History</h1>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Transaction</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-medium">Amount</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {userTxs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No transactions found</td></tr>
                ) : userTxs.map(tx => {
                  const isIn = tx.toUserId === currentUser.id
                  return (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIn ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isIn ? <ArrowDownLeft size={14} className="text-green-600" /> : <ArrowUpRight size={14} className="text-red-600" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{tx.description}</div>
                            <div className="text-xs text-gray-500">{tx.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{tx.type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${isIn ? 'text-green-600' : 'text-red-600'}`}>
                        {isIn ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          tx.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>{tx.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
