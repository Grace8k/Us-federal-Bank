import { Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import {
  Home, Send, Download, FileText, CreditCard, Bell, User, LogOut,
  ChevronLeft, ChevronRight, DollarSign, Repeat, Landmark, PiggyBank,
  Smartphone, BarChart2, Users, HelpCircle, Menu, Star
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Send Money', to: '/dashboard/send-money', icon: Send },
  { label: 'Receive Money', to: '/dashboard/receive-money', icon: Download },
  { label: 'Pay Bills', to: '/dashboard/pay-bills', icon: DollarSign },
  { label: 'Buy Airtime', to: '/dashboard/buy-airtime', icon: Smartphone },
  { label: 'Transactions', to: '/dashboard/transactions', icon: FileText },
  { label: 'Statements', to: '/dashboard/statements', icon: BarChart2 },
  { label: 'Transfers', to: '/dashboard/transfers', icon: Repeat },
  { label: 'Loans', to: '/dashboard/loans', icon: Landmark },
  { label: 'Fixed Deposit', to: '/dashboard/fixed-deposit', icon: PiggyBank },
  { label: 'Cards', to: '/dashboard/cards', icon: CreditCard },
  { label: 'Beneficiaries', to: '/dashboard/beneficiaries', icon: Users },
  { label: 'Exchange Rates', to: '/dashboard/exchange-rates', icon: Star },
  { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
  { label: 'Support', to: '/dashboard/support', icon: HelpCircle },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, notifications } = useBankingStore()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.navigate({ to: '/login' })
    }
  }, [currentUser, router])

  const unread = notifications.filter(n => n.userId === currentUser?.id && !n.read).length

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/login' })
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-full md:h-screen flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ backgroundColor: '#1e3a5f' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-blue-800">
          <div style={{ backgroundColor: '#c9a227' }} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">USF</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm leading-tight">US Federal Bank</div>
              <div style={{ color: '#c9a227' }} className="text-xs">Online Banking</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-blue-800 transition-colors text-sm"
              activeProps={{ className: 'flex items-center gap-3 px-4 py-2.5 text-white bg-blue-700 border-r-4 border-yellow-400 text-sm' }}
              activeOptions={{ exact: to === '/dashboard' }}
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {label === 'Notifications' && unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-blue-800 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3">
              <div style={{ backgroundColor: '#c9a227' }} className="w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">{currentUser.name.charAt(0)}</span>
              </div>
              <div className="overflow-hidden">
                <div className="text-white text-sm font-medium truncate">{currentUser.name}</div>
                <div className="text-gray-400 text-xs truncate">{currentUser.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm w-full px-1"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full w-6 h-6 items-center justify-center shadow-sm"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={22} style={{ color: '#1e3a5f' }} />
            </button>
            <div>
              <div className="text-sm font-semibold text-gray-800">Welcome back, {currentUser.name.split(' ')[0]}!</div>
              <div className="text-xs text-gray-500">Account: {currentUser.accountNumber}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/notifications" className="relative">
              <Bell size={20} className="text-gray-600" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
              )}
            </Link>
            <span className={`text-xs px-2 py-1 rounded-full ${currentUser.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {currentUser.kycStatus === 'verified' ? '✓ Verified' : 'KYC Pending'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
