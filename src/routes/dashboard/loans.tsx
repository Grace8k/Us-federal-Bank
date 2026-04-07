import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Landmark, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/loans')({
  component: LoansPage,
})

function LoansPage() {
  const { currentUser, loans, applyLoan } = useBankingStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ amount: '', interestRate: '8.5', term: '12', purpose: '' })
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userLoans = loans.filter(l => l.userId === currentUser.id)
  const monthly = form.amount && form.interestRate && form.term
    ? (parseFloat(form.amount) * (parseFloat(form.interestRate) / 100 / 12)) / (1 - Math.pow(1 + parseFloat(form.interestRate) / 100 / 12, -parseInt(form.term)))
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyLoan({ userId: currentUser.id, amount: parseFloat(form.amount), interestRate: parseFloat(form.interestRate), term: parseInt(form.term), purpose: form.purpose })
    setSubmitted(true)
    setShowForm(false)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Loans</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#c9a227' }}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90">
            Apply for Loan
          </button>
        </div>

        {submitted && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-green-700">Loan application submitted! We'll review within 1-2 business days.</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Loan Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount ($)</label>
                  <input type="number" min="500" max="50000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <select value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="6.5">6.5% - Excellent Credit</option>
                    <option value="8.5">8.5% - Good Credit</option>
                    <option value="11.5">11.5% - Fair Credit</option>
                    <option value="14.5">14.5% - Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term (Months)</label>
                  <select value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {[6, 12, 24, 36, 48, 60].map(t => <option key={t} value={t}>{t} months</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. Monthly Payment</label>
                  <div className="px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm font-semibold" style={{ color: '#1e3a5f' }}>
                    {monthly > 0 ? `$${monthly.toFixed(2)}` : '—'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
                <select value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Select purpose</option>
                  {['Personal', 'Home Improvement', 'Debt Consolidation', 'Medical', 'Education', 'Business', 'Vehicle', 'Other'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" style={{ backgroundColor: '#1e3a5f' }} className="flex-1 py-2.5 rounded-lg text-white font-semibold">Submit Application</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {userLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Landmark size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No loan applications yet.</p>
            <button onClick={() => setShowForm(true)} style={{ color: '#c9a227' }} className="mt-2 text-sm hover:underline">Apply for your first loan</button>
          </div>
        ) : (
          <div className="space-y-4">
            {userLoans.map(loan => (
              <div key={loan.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{loan.purpose} Loan</h3>
                    <p className="text-sm text-gray-500">Applied: {new Date(loan.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'approved' || loan.status === 'active' ? 'bg-green-100 text-green-700' :
                    loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    loan.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{loan.status.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-500">Loan Amount</p><p className="font-semibold">${loan.amount.toLocaleString()}</p></div>
                  <div><p className="text-gray-500">Interest Rate</p><p className="font-semibold">{loan.interestRate}% APR</p></div>
                  <div><p className="text-gray-500">Term</p><p className="font-semibold">{loan.term} months</p></div>
                  <div><p className="text-gray-500">Monthly Payment</p><p className="font-semibold">${loan.monthlyPayment.toFixed(2)}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
