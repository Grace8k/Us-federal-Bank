import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export const Route = createFileRoute('/dashboard/statements')({
  component: StatementsPage,
})

function StatementsPage() {
  const { currentUser, transactions } = useBankingStore()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userTxs = transactions
    .filter(t => t.fromUserId === currentUser.id || t.toUserId === currentUser.id)
    .filter(t => t.date.startsWith(selectedMonth))

  const totalIn = userTxs.filter(t => t.toUserId === currentUser.id && t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const totalOut = userTxs.filter(t => t.fromUserId === currentUser.id && t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const handleDownload = () => {
    const lines = [
      'United State Federal Bank - Account Statement',
      `Account: ${currentUser.accountNumber}`,
      `Period: ${selectedMonth}`,
      '',
      'Date,Description,Type,Amount,Status',
      ...userTxs.map(t => {
        const isIn = t.toUserId === currentUser.id
        return `${new Date(t.date).toLocaleDateString()},${t.description},${t.type},${isIn ? '+' : '-'}${t.amount.toFixed(2)},${t.status}`
      }),
      '',
      `Total Credits: $${totalIn.toFixed(2)}`,
      `Total Debits: $${totalOut.toFixed(2)}`,
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statement-${selectedMonth}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Account Statements</h1>
          <button onClick={handleDownload} style={{ backgroundColor: '#c9a227' }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90">
            <Download size={16} /> Download CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Statement Period</label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm">
            {months.map(m => {
              const [y, mo] = m.split('-')
              const d = new Date(parseInt(y), parseInt(mo) - 1)
              return <option key={m} value={m}>{d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>
            })}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-600 text-sm">Total Credits</p>
            <p className="text-2xl font-bold text-green-700">+${totalIn.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">Total Debits</p>
            <p className="text-2xl font-bold text-red-700">-${totalOut.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Description</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Amount</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {userTxs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">No transactions for this period</td></tr>
              ) : userTxs.map(tx => {
                const isIn = tx.toUserId === currentUser.id
                return (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isIn ? <ArrowDownLeft size={14} className="text-green-600" /> : <ArrowUpRight size={14} className="text-red-600" />}
                        <span className="text-gray-800">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${isIn ? 'text-green-600' : 'text-red-600'}`}>
                      {isIn ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{tx.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
