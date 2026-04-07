import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Smartphone } from 'lucide-react'

export const Route = createFileRoute('/admin/airtime')({
  component: AdminAirtimePage,
})

function AdminAirtimePage() {
  const { transactions, users } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const airtimeTxs = transactions.filter(t => t.type === 'airtime')
  const totalAirtime = airtimeTxs.reduce((s, t) => s + t.amount, 0)
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Airtime Management</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Airtime Transactions</div>
            <div className="text-2xl font-bold text-white">{airtimeTxs.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Airtime Volume</div>
            <div className="text-2xl font-bold text-white">${totalAirtime.toFixed(2)}</div>
          </div>
        </div>

        {airtimeTxs.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <Smartphone size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No airtime transactions yet.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Customer', 'Description', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {airtimeTxs.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-700">
                    <td className="px-4 py-3 text-white">{getUserName(tx.fromUserId)}</td>
                    <td className="px-4 py-3 text-slate-300">{tx.description}</td>
                    <td className="px-4 py-3 text-white font-semibold">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
