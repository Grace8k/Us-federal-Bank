import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Copy, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/receive-money')({
  component: ReceiveMoneyPage,
})

function ReceiveMoneyPage() {
  const { currentUser } = useBankingStore()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const copyAccount = () => {
    navigator.clipboard.writeText(currentUser.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Receive Money</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <p className="text-gray-600 text-sm mb-6">Share your account details with the sender to receive funds. Transfers to your account are processed instantly.</p>

          <div className="space-y-4">
            {[
              { label: 'Account Holder', value: currentUser.name },
              { label: 'Account Number', value: currentUser.accountNumber, copy: true },
              { label: 'Bank Name', value: 'United State Federal Bank' },
              { label: 'Routing Number', value: '021000021' },
              { label: 'Account Type', value: currentUser.accountType === 'checking' ? 'Checking' : 'Savings' },
              { label: 'Bank Address', value: '100 Federal Plaza, New York, NY 10007' },
            ].map(({ label, value, copy }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{value}</span>
                  {copy && (
                    <button onClick={copyAccount} className="text-gray-400 hover:text-gray-600">
                      {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">How to receive money:</p>
            <ol className="text-sm text-blue-600 mt-2 space-y-1 list-decimal list-inside">
              <li>Share your account number with the sender</li>
              <li>Sender transfers funds to your account</li>
              <li>Funds appear in your account within minutes (in-bank) or 1-3 days (external)</li>
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
