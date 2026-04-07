import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/dashboard/exchange-rates')({
  component: ExchangeRatesPage,
})

function ExchangeRatesPage() {
  const { systemSettings } = useBankingStore()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const rates = systemSettings.exchangeRates
  const currencies = Object.keys(rates)
  const converted = parseFloat(amount) * (rates[to] / rates[from])

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Exchange Rates</h1>

        {/* Converter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Currency Converter</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-sm">
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => { setFrom(to); setTo(from) }} className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw size={16} className="text-gray-500" />
            </button>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-sm">
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ backgroundColor: '#1e3a5f' }} className="rounded-xl p-4 mt-4 text-center text-white">
            <div className="text-sm text-blue-200">{amount} {from} =</div>
            <div className="text-3xl font-bold mt-1">{converted.toFixed(4)} {to}</div>
            <div className="text-sm text-blue-300 mt-1">Rate: 1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</div>
          </div>
        </div>

        {/* Rate Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">Live Exchange Rates (Base: USD)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Rates updated daily. Indicative only.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Currency</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Rate (per USD)</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {currencies.filter(c => c !== 'USD').map((c, i) => (
                <tr key={c} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{c}</div>
                    <div className="text-xs text-gray-500">{{ EUR: 'Euro', GBP: 'British Pound', CAD: 'Canadian Dollar', JPY: 'Japanese Yen', AUD: 'Australian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan' }[c]}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-gray-800">{rates[c].toFixed(4)}</td>
                  <td className="px-4 py-3 text-right">
                    {i % 2 === 0
                      ? <span className="flex items-center justify-end gap-1 text-green-600 text-xs"><TrendingUp size={12} /> +0.{Math.floor(Math.random() * 50 + 10)}%</span>
                      : <span className="flex items-center justify-end gap-1 text-red-500 text-xs"><TrendingDown size={12} /> -0.{Math.floor(Math.random() * 30 + 5)}%</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
