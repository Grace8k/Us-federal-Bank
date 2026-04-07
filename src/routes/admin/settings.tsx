import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Save, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  const { systemSettings, adminLogAction } = useBankingStore()
  const [settings, setSettings] = useState(systemSettings)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSettings(systemSettings)
  }, [systemSettings])
  if (!mounted) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    useBankingStore.setState({ systemSettings: settings })
    adminLogAction({ adminEmail: 'admin@unitedstatebank.com', action: 'UPDATE_SETTINGS', details: 'System settings updated' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>

        {saved && (
          <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-400" />
            <span className="text-green-300">Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">Bank Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Bank Name</label>
                <input type="text" value={settings.bankName} onChange={e => setSettings(s => ({ ...s, bankName: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Monthly Maintenance Fee ($)</label>
                  <input type="number" min="0" step="0.01" value={settings.maintenanceFee} onChange={e => setSettings(s => ({ ...s, maintenanceFee: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Wire Transfer Fee ($)</label>
                  <input type="number" min="0" step="0.01" value={settings.wireTransferFee} onChange={e => setSettings(s => ({ ...s, wireTransferFee: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">Exchange Rates (per USD)</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(settings.exchangeRates).filter(([c]) => c !== 'USD').map(([currency, rate]) => (
                <div key={currency}>
                  <label className="block text-slate-400 text-sm mb-1">{currency}</label>
                  <input type="number" min="0.0001" step="0.0001" value={rate}
                    onChange={e => setSettings(s => ({ ...s, exchangeRates: { ...s.exchangeRates, [currency]: parseFloat(e.target.value) } }))}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: '#c9a227' }} className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90">
            <Save size={16} /> Save Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
