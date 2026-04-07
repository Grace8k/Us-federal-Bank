import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PiggyBank, CheckCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/fixed-deposit')({
  component: FixedDepositPage,
})

const fdRates = [
  { term: 3, rate: 3.5 },
  { term: 6, rate: 4.25 },
  { term: 12, rate: 5.0 },
  { term: 24, rate: 5.75 },
  { term: 36, rate: 6.0 },
]

function FixedDepositPage() {
  const { currentUser, fixedDeposits, addFixedDeposit, updateBalance, addTransaction, addNotification } = useBankingStore()
  const [form, setForm] = useState({ amount: '', term: '12' })
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userFDs = fixedDeposits.filter(f => f.userId === currentUser.id)
  const selectedRate = fdRates.find(r => r.term === parseInt(form.term))
  const returns = form.amount && selectedRate ? parseFloat(form.amount) * (selectedRate.rate / 100) * (selectedRate.term / 12) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (currentUser.balance < amount) return setResult({ success: false, error: 'Insufficient balance' })
    if (amount < 500) return setResult({ success: false, error: 'Minimum fixed deposit is $500' })
    const maturity = new Date()
    maturity.setMonth(maturity.getMonth() + parseInt(form.term))
    updateBalance(currentUser.id, -amount)
    addTransaction({ fromUserId: currentUser.id, toUserId: 'bank_fd', type: 'fixed_deposit', amount, description: `Fixed Deposit - ${form.term} months`, status: 'completed', category: 'Investment' })
    addFixedDeposit({ userId: currentUser.id, amount, interestRate: selectedRate!.rate, term: parseInt(form.term), maturityDate: maturity.toISOString(), status: 'active' })
    addNotification({ userId: currentUser.id, title: 'Fixed Deposit Created', message: `$${amount.toFixed(2)} placed in ${form.term}-month fixed deposit at ${selectedRate!.rate}% p.a.`, type: 'success', read: false })
    setResult({ success: true })
    setForm({ amount: '', term: '12' })
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Fixed Deposits</h1>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">Available Balance:</span>
          <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>${currentUser.balance.toFixed(2)}</span>
        </div>

        {/* Rate Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Fixed Deposit Rates</h3>
          <div className="grid grid-cols-5 gap-2">
            {fdRates.map(r => (
              <button key={r.term} type="button" onClick={() => setForm(f => ({ ...f, term: String(r.term) }))}
                className={`p-3 rounded-xl border-2 text-center transition-all ${form.term === String(r.term) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                <div className="font-bold text-lg" style={{ color: '#c9a227' }}>{r.rate}%</div>
                <div className="text-xs text-gray-500">{r.term} months</div>
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className={result.success ? 'text-green-700' : 'text-red-700'}>{result.success ? 'Fixed deposit created successfully!' : result.error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount ($)</label>
              <input type="number" min="500" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Minimum $500" />
            </div>
            {form.amount && selectedRate && (
              <div className="p-4 bg-blue-50 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-600">Principal:</span><span className="font-medium">${parseFloat(form.amount).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Interest Rate:</span><span className="font-medium">{selectedRate.rate}% p.a.</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Term:</span><span className="font-medium">{selectedRate.term} months</span></div>
                <div className="flex justify-between border-t border-blue-200 pt-1 mt-1"><span className="text-gray-600">Interest Earned:</span><span className="font-bold text-green-600">+${returns.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Maturity Amount:</span><span className="font-bold" style={{ color: '#1e3a5f' }}>${(parseFloat(form.amount) + returns).toFixed(2)}</span></div>
              </div>
            )}
            <button type="submit" style={{ backgroundColor: '#1e3a5f' }}
              className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90">
              <PiggyBank size={18} /> Create Fixed Deposit
            </button>
          </form>
        </div>

        {userFDs.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Your Fixed Deposits</h3>
            <div className="space-y-3">
              {userFDs.map(fd => (
                <div key={fd.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">${fd.amount.toLocaleString()} — {fd.term} months</div>
                      <div className="text-sm text-gray-500">Rate: {fd.interestRate}% | Matures: {new Date(fd.maturityDate).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${fd.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{fd.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
