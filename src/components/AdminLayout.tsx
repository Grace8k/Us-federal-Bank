import { Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, FileText, CreditCard, Landmark,
  Smartphone, Bell, Settings, BarChart2, ClipboardList,
  LogOut, Menu, Shield, UserCheck
} from 'lucide-react'

const ADMIN_EMAIL = 'admin@unitedstatebank.com'

const navItems = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Accounts', to: '/admin/accounts', icon: CreditCard },
  { label: 'Transactions', to: '/admin/transactions', icon: FileText },
  { label: 'KYC Verification', to: '/admin/kyc', icon: UserCheck },
  { label: 'Loans', to: '/admin/loans', icon: Landmark },
  { label: 'Airtime', to: '/admin/airtime', icon: Smartphone },
  { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  { label: 'Reports', to: '/admin/reports', icon: BarChart2 },
  { label: 'Audit Logs', to: '/admin/logs', icon: ClipboardList },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn')
    if (!adminLoggedIn) {
      router.navigate({ to: '/login' })
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    router.navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-screen w-64 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ backgroundColor: '#1e293b' }}
      >
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div style={{ backgroundColor: '#c9a227' }} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Admin Panel</div>
            <div className="text-slate-400 text-xs">United State Federal Bank</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm"
              activeProps={{ className: 'flex items-center gap-3 px-4 py-2.5 text-white bg-slate-700 border-r-4 border-yellow-400 text-sm' }}
              activeOptions={{ exact: to === '/admin' }}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <div className="text-slate-400 text-xs mb-2">{ADMIN_EMAIL}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={22} />
            </button>
            <div>
              <span className="text-white font-semibold text-sm">Administration Dashboard</span>
              <span className="ml-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded">ADMIN</span>
            </div>
          </div>
          <div className="text-slate-400 text-xs">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto" style={{ backgroundColor: '#0f172a' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
