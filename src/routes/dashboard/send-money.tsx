import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/send-money')({
  component: SendMoneyPage,
})

function SendMoneyPage() {
  const { currentUser, sendMoney, beneficiaries } = useBankingStore()
  const [form, setForm] = useState({ toAccount: '', amount: '', description: '' })
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userBens = beneficiaries.filter(b => b.userId === currentUser.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const res = sendMoney(currentUser.id, form.toAccount, parseFloat(form.amount), form.description)
    setLoading(false)
    setResult(res)
    if (res.success) setForm({ toAccount: '', amount: '', description: '' })
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Send Money</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">Available Balance:</span>
            <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>${currentUser.balance.toFixed(2)}</span>
          </div>
        </div>

        {result && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className={result.success ? 'text-green-700' : 'text-red-700'}>{result.success ? 'Transfer successful!' : result.error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {userBens.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select Beneficiary</label>
              <div className="flex flex-wrap gap-2">
                {userBens.map(b => (
                  <button key={b.id} type="button" onClick={() => setForm(f => ({ ...f, toAccount: b.accountNumber }))}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 hover:bg-blue-100">
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
              <input type="text" value={form.toAccount} onChange={e => setForm(f => ({ ...f, toAccount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter account number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Memo</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="What is this for?" />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#1e3a5f' }}
              className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Money'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
