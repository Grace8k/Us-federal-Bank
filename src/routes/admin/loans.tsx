import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'

export const Route = createFileRoute('/admin/loans')({
  component: AdminLoansPage,
})

function AdminLoansPage() {
  const { loans, users, updateLoanStatus } = useBankingStore()
  const [filter, setFilter] = useState('all')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id
  const filtered = loans.filter(l => filter === 'all' || l.status === filter)

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Loan Management</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`p-4 rounded-xl border text-left transition-all ${filter === s ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' : 'border-slate-700 bg-slate-800'}`}>
              <div className="text-slate-400 text-xs capitalize">{s}</div>
              <div className="text-2xl font-bold text-white mt-1">{s === 'all' ? loans.length : loans.filter(l => l.status === s).length}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Applicant', 'Amount', 'Rate', 'Term', 'Monthly', 'Purpose', 'Applied', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-10 text-slate-500">No loans found</td></tr>
                ) : filtered.map(loan => (
                  <tr key={loan.id} className="border-b border-slate-700">
                    <td className="px-4 py-3 text-white">{getUserName(loan.userId)}</td>
                    <td className="px-4 py-3 text-white font-semibold">${loan.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-300">{loan.interestRate}%</td>
                    <td className="px-4 py-3 text-slate-300">{loan.term}mo</td>
                    <td className="px-4 py-3 text-slate-300">${loan.monthlyPayment.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-300">{loan.purpose}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        loan.status === 'approved' || loan.status === 'active' ? 'bg-green-900 text-green-300' :
                        loan.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>{loan.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {loan.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => updateLoanStatus(loan.id, 'approved')} className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded hover:bg-green-700">Approve</button>
                          <button onClick={() => updateLoanStatus(loan.id, 'rejected')} className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded hover:bg-red-800">Reject</button>
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
