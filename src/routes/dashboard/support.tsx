import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { HelpCircle, CheckCircle, MessageSquare, Phone, Mail } from 'lucide-react'

export const Route = createFileRoute('/dashboard/support')({
  component: SupportPage,
})

function SupportPage() {
  const { currentUser, addNotification } = useBankingStore()
  const [form, setForm] = useState({ subject: '', category: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addNotification({ userId: currentUser.id, title: 'Support Ticket Created', message: `Your support ticket "${form.subject}" has been received. We'll respond within 24 hours.`, type: 'info', read: false })
    setSubmitted(true)
    setForm({ subject: '', category: '', message: '' })
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Customer Support</h1>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Phone, label: 'Call Us', info: '1-800-USFBANK', sub: '24/7 Available', color: '#1e3a5f' },
            { icon: Mail, label: 'Email', info: 'support@usfbank.com', sub: 'Response in 24h', color: '#059669' },
            { icon: MessageSquare, label: 'Live Chat', info: 'Start Chat', sub: 'Mon-Fri 8am-8pm', color: '#7c3aed' },
          ].map(({ icon: Icon, label, info, sub, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div style={{ backgroundColor: color + '20' }} className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon size={18} style={{ color }} />
              </div>
              <div className="font-semibold text-gray-800 text-sm">{label}</div>
              <div style={{ color }} className="text-sm font-medium">{info}</div>
              <div className="text-gray-500 text-xs">{sub}</div>
            </div>
          ))}
        </div>

        {submitted && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-green-700">Support ticket submitted! We'll respond within 24 hours.</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <HelpCircle size={18} style={{ color: '#c9a227' }} /> Submit a Support Ticket
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select category</option>
                {['Account Issues', 'Transaction Dispute', 'Card Issues', 'Loan Inquiry', 'Technical Support', 'KYC Verification', 'Security Concern', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                placeholder="Please describe your issue in detail..." />
            </div>
            <button type="submit" style={{ backgroundColor: '#1e3a5f' }}
              className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90">
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
