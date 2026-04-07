import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Users, Plus, Trash2, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/beneficiaries')({
  component: BeneficiariesPage,
})

function BeneficiariesPage() {
  const { currentUser, beneficiaries, addBeneficiary, deleteBeneficiary } = useBankingStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: 'United State Federal Bank', email: '' })
  const [added, setAdded] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userBens = beneficiaries.filter(b => b.userId === currentUser.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addBeneficiary({ userId: currentUser.id, ...form })
    setAdded(true)
    setShowForm(false)
    setForm({ name: '', accountNumber: '', bankName: 'United State Federal Bank', email: '' })
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Beneficiaries</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#c9a227' }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90">
            <Plus size={16} /> Add Beneficiary
          </button>
        </div>

        {added && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-green-700">Beneficiary added successfully!</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Beneficiary</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Recipient name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="text" value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Account number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input type="text" value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="email@example.com" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" style={{ backgroundColor: '#1e3a5f' }} className="px-6 py-2.5 rounded-lg text-white font-semibold">Save Beneficiary</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {userBens.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No beneficiaries saved yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Account Number</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Bank</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Added</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userBens.map(ben => (
                  <tr key={ben.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{ben.name}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{ben.accountNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{ben.bankName}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(ben.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => deleteBeneficiary(ben.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
