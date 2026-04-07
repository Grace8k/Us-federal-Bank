import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ArrowUpRight, ArrowDownLeft, DollarSign, Send, Download, FileText, CreditCard, Landmark, Smartphone, Repeat, Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { currentUser, transactions } = useBankingStore()
  const [hideBalance, setHideBalance] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !currentUser) return null

  const userTxs = transactions
    .filter(t => t.fromUserId === currentUser.id || t.toUserId === currentUser.id)
    .slice(0, 5)

  const totalIn = transactions
    .filter(t => t.toUserId === currentUser.id && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)

  const totalOut = transactions
    .filter(t => t.fromUserId === currentUser.id && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)

  const quickActions = [
    { label: 'Send Money', to: '/dashboard/send-money', icon: Send, color: '#1e3a5f' },
    { label: 'Receive', to: '/dashboard/receive-money', icon: Download, color: '#15803d' },
    { label: 'Pay Bills', to: '/dashboard/pay-bills', icon: DollarSign, color: '#b45309' },
    { label: 'Buy Airtime', to: '/dashboard/buy-airtime', icon: Smartphone, color: '#7c3aed' },
    { label: 'Transactions', to: '/dashboard/transactions', icon: FileText, color: '#0891b2' },
    { label: 'Transfers', to: '/dashboard/transfers', icon: Repeat, color: '#db2777' },
    { label: 'Loans', to: '/dashboard/loans', icon: Landmark, color: '#dc2626' },
    { label: 'Cards', to: '/dashboard/cards', icon: CreditCard, color: '#059669' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance card */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2040 100%)' }} className="rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-200 text-sm">Account Balance</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-4xl font-bold">
                  {hideBalance ? '••••••' : `$${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </h2>
                <button onClick={() => setHideBalance(!hideBalance)} className="text-blue-300 hover:text-white">
                  {hideBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-1">
                {currentUser.accountType === 'checking' ? 'Checking' : 'Savings'} Account
              </p>
            </div>
            <div style={{ backgroundColor: '#c9a227' }} className="w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">USF</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                <ArrowDownLeft size={14} /> Total Received
              </div>
              <div className="text-white font-bold text-lg">${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                <ArrowUpRight size={14} /> Total Sent
              </div>
              <div className="text-white font-bold text-lg">${totalOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-700 flex justify-between text-sm">
            <span className="text-blue-200">Account: <span className="text-white font-mono">{currentUser.accountNumber}</span></span>
            <span className={`px-2 py-0.5 rounded text-xs ${currentUser.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
              {currentUser.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <Link to="/dashboard/transactions" style={{ color: '#c9a227' }} className="text-sm hover:underline">View All</Link>
          </div>
          {userTxs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {userTxs.map(tx => {
                const isIn = tx.toUserId === currentUser.id
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isIn ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isIn ? <ArrowDownLeft size={16} className="text-green-600" /> : <ArrowUpRight size={16} className="text-red-600" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{tx.description}</div>
                        <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${isIn ? 'text-green-600' : 'text-red-600'}`}>
                        {isIn ? '+' : '-'}${tx.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${tx.status === 'completed' ? 'text-green-500' : tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
