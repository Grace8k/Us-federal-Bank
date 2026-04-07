import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Shield, Lock, Menu, X, Phone, Mail, MapPin } from 'lucide-react'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: '#1e3a5f' }} className="text-white text-xs py-1 px-4 flex justify-between items-center">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Phone size={11} /> 1-800-USFBANK</span>
          <span className="flex items-center gap-1"><Mail size={11} /> support@unitedstatefederal.com</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Shield size={11} /> FDIC Insured</span>
          <span className="flex items-center gap-1"><Lock size={11} /> 256-bit SSL</span>
        </span>
      </div>

      {/* Header */}
      <header style={{ backgroundColor: '#1e3a5f' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div style={{ backgroundColor: '#c9a227' }} className="w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">USF</span>
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-tight">United State Federal Bank</div>
              <div style={{ color: '#c9a227' }} className="text-xs">Your Trusted Banking Partner Since 1995</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-white text-sm">
            <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
            <Link to="/faq" className="hover:text-yellow-400 transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
            <Link to="/login" style={{ backgroundColor: '#c9a227' }} className="px-4 py-2 rounded font-semibold text-white hover:opacity-90 transition-opacity">
              Sign In
            </Link>
            <Link to="/register" className="border border-yellow-400 px-4 py-2 rounded text-yellow-400 hover:bg-yellow-400 hover:text-white transition-all">
              Open Account
            </Link>
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div style={{ backgroundColor: '#163050' }} className="md:hidden px-4 pb-4 flex flex-col gap-3 text-white text-sm">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-2 border-b border-blue-700">About</Link>
            <Link to="/faq" onClick={() => setMobileOpen(false)} className="py-2 border-b border-blue-700">FAQ</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-2 border-b border-blue-700">Contact</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ backgroundColor: '#c9a227' }} className="py-2 px-4 rounded text-center font-semibold">Sign In</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)} className="py-2 px-4 rounded border border-yellow-400 text-yellow-400 text-center">Open Account</Link>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1e3a5f' }} className="text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div style={{ backgroundColor: '#c9a227' }} className="w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <span className="text-white font-bold">USF</span>
            </div>
            <h3 className="font-bold text-lg mb-2">United State Federal Bank</h3>
            <p className="text-gray-300 text-sm">Your trusted banking partner since 1995. Serving millions of Americans with pride.</p>
            <div className="flex gap-3 mt-4">
              <span className="bg-green-600 text-xs px-2 py-1 rounded">FDIC Insured</span>
              <span className="bg-blue-600 text-xs px-2 py-1 rounded">SSL Secured</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#c9a227' }} className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white">Online Banking</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#c9a227' }} className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#c9a227' }} className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><Phone size={14} /> 1-800-USFBANK</li>
              <li className="flex items-center gap-2"><Mail size={14} /> support@unitedstatefederal.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> 100 Federal Plaza, New York, NY 10007</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 py-4 text-center text-gray-400 text-xs">
          <p>© {new Date().getFullYear()} United State Federal Bank. All rights reserved. Member FDIC. Equal Housing Lender.</p>
          <p className="mt-1">Deposits are insured by the FDIC up to $250,000 per depositor, per ownership category.</p>
        </div>
      </footer>
    </div>
  )
}
