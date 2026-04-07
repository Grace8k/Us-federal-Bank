import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/transfers')({
  component: TransfersPage,
})

function TransfersPage() {
  const { currentUser, sendMoney, addTransaction, updateBalance, systemSettings } = useBankingStore()
  const [tab, setTab] = useState<'internal' | 'wire'>('internal')
  const [form, setForm] = useState({ toAccount: '', amount: '', description: '', bankName: '', routingNumber: '' })
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    if (tab === 'internal') {
      const res = sendMoney(currentUser.id, form.toAccount, parseFloat(form.amount), form.description)
      setResult(res)
      if (res.success) setForm({ toAccount: '', amount: '', description: '', bankName: '', routingNumber: '' })
    } else {
      const amount = parseFloat(form.amount)
      const fee = systemSettings.wireTransferFee
      const total = amount + fee
      if (currentUser.balance < total) {
        setResult({ success: false, error: `Insufficient balance. Total with $${fee} wire fee: $${total.toFixed(2)}` })
      } else {
        updateBalance(currentUser.id, -total)
        addTransaction({ fromUserId: currentUser.id, toUserId: 'external_wire', type: 'wire_transfer', amount, description: `Wire Transfer to ${form.bankName} - ${form.toAccount}`, status: 'completed', category: 'Wire Transfer' })
        setResult({ success: true })
        setForm({ toAccount: '', amount: '', description: '', bankName: '', routingNumber: '' })
      }
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Fund Transfers</h1>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Available Balance:</span>
            <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>${currentUser.balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-xl shadow-sm p-1">
          {(['internal', 'wire'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
              style={{ backgroundColor: tab === t ? '#1e3a5f' : 'transparent' }}>
              {t === 'internal' ? 'Internal Transfer' : `Wire Transfer ($${systemSettings.wireTransferFee} fee)`}
            </button>
          ))}
        </div>

        {result && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className={result.success ? 'text-green-700' : 'text-red-700'}>{result.success ? 'Transfer successful!' : result.error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'wire' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Bank Name</label>
                  <input type="text" value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Bank of America" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input type="text" value={form.routingNumber} onChange={e => setForm(f => ({ ...f, routingNumber: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="9-digit routing number" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input type="text" value={form.toAccount} onChange={e => setForm(f => ({ ...f, toAccount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Recipient account number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0.00" />
              {tab === 'wire' && form.amount && (
                <p className="text-xs text-gray-500 mt-1">Wire fee: ${systemSettings.wireTransferFee} | Total: ${(parseFloat(form.amount || '0') + systemSettings.wireTransferFee).toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Transfer memo" />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#1e3a5f' }}
              className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50">
              {loading ? 'Processing...' : 'Transfer Funds'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
