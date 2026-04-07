import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/pay-bills')({
  component: PayBillsPage,
})

const billTypes = [
  { label: 'Electricity', icon: '⚡', category: 'Utility' },
  { label: 'Gas', icon: '🔥', category: 'Utility' },
  { label: 'Water', icon: '💧', category: 'Utility' },
  { label: 'Internet', icon: '🌐', category: 'Telecom' },
  { label: 'Phone', icon: '📱', category: 'Telecom' },
  { label: 'Cable TV', icon: '📺', category: 'Entertainment' },
  { label: 'Health Insurance', icon: '🏥', category: 'Insurance' },
  { label: 'Car Insurance', icon: '🚗', category: 'Insurance' },
  { label: 'Rent', icon: '🏠', category: 'Housing' },
  { label: 'Credit Card', icon: '💳', category: 'Finance' },
  { label: 'Student Loan', icon: '🎓', category: 'Finance' },
  { label: 'Other', icon: '📄', category: 'Other' },
]

function PayBillsPage() {
  const { currentUser, payBill } = useBankingStore()
  const [selectedBill, setSelectedBill] = useState('')
  const [form, setForm] = useState({ accountRef: '', amount: '' })
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBill) return
    setResult(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const res = payBill(currentUser.id, selectedBill, parseFloat(form.amount), form.accountRef)
    setLoading(false)
    setResult(res)
    if (res.success) { setForm({ accountRef: '', amount: '' }); setSelectedBill('') }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1e3a5f' }}>Pay Bills</h1>
        <p className="text-gray-500 text-sm mb-6">Pay your bills quickly and securely.</p>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">Available Balance:</span>
          <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>${currentUser.balance.toFixed(2)}</span>
        </div>

        {result && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className={result.success ? 'text-green-700' : 'text-red-700'}>{result.success ? 'Bill paid successfully!' : result.error}</span>
          </div>
        )}

        {/* Bill type selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-gray-700 mb-4">Select Bill Type</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {billTypes.map(bill => (
              <button key={bill.label} type="button" onClick={() => setSelectedBill(bill.label)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${selectedBill === bill.label ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                <span className="text-xl">{bill.icon}</span>
                <span className="text-xs text-gray-600 text-center">{bill.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedBill && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Pay {selectedBill}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account / Reference Number</label>
                <input type="text" value={form.accountRef} onChange={e => setForm(f => ({ ...f, accountRef: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Your account/reference number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0.00" />
              </div>
              <button type="submit" disabled={loading} style={{ backgroundColor: '#1e3a5f' }}
                className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50">
                {loading ? 'Processing...' : `Pay ${selectedBill}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

