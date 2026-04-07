import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CheckCircle, AlertCircle, Smartphone } from 'lucide-react'

export const Route = createFileRoute('/dashboard/buy-airtime')({
  component: BuyAirtimePage,
})

const networks = ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'US Cellular', 'Metro PCS', 'Boost Mobile', 'Cricket Wireless']
const presetAmounts = [5, 10, 15, 20, 25, 50]

function BuyAirtimePage() {
  const { currentUser, buyAirtime } = useBankingStore()
  const [form, setForm] = useState({ phone: '', network: '', amount: '' })
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
    const res = buyAirtime(currentUser.id, form.phone, parseFloat(form.amount), form.network)
    setLoading(false)
    setResult(res)
    if (res.success) setForm({ phone: '', network: '', amount: '' })
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Buy Airtime</h1>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">Available Balance:</span>
          <span className="font-bold text-lg" style={{ color: '#1e3a5f' }}>${currentUser.balance.toFixed(2)}</span>
        </div>

        {result && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className={result.success ? 'text-green-700' : 'text-red-700'}>{result.success ? 'Airtime purchased successfully!' : result.error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ backgroundColor: '#7c3aed20' }} className="w-12 h-12 rounded-full flex items-center justify-center">
              <Smartphone size={22} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Mobile Top-Up</h3>
              <p className="text-sm text-gray-500">Instantly top up any US mobile number</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Network</label>
              <select value={form.network} onChange={e => setForm(f => ({ ...f, network: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select network carrier</option>
                {networks.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presetAmounts.map(amt => (
                  <button key={amt} type="button" onClick={() => setForm(f => ({ ...f, amount: String(amt) }))}
                    className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.amount === String(amt) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    ${amt}
                  </button>
                ))}
              </div>
              <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Or enter custom amount" />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#7c3aed' }}
              className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              <Smartphone size={18} />
              {loading ? 'Processing...' : 'Buy Airtime'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
