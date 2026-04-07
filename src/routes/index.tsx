import { createFileRoute, Link } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'
import { Shield, Lock, TrendingUp, Users, Phone, ArrowRight, CheckCircle, Star } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #163050 60%, #0d1f35 100%)' }} className="text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div style={{ backgroundColor: '#c9a227' }} className="inline-block text-white text-xs font-bold px-3 py-1 rounded mb-4">
              FDIC INSURED · EST. 1995
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Banking You Can <span style={{ color: '#c9a227' }}>Trust</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              United State Federal Bank — Your Trusted Banking Partner Since 1995. Secure, reliable, and always here for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" style={{ backgroundColor: '#c9a227' }} className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 flex items-center gap-2">
                Open Account <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-blue-900 transition-colors font-semibold">
                Online Banking
              </Link>
            </div>
            <div className="flex gap-6 mt-8">
              <div className="text-center">
                <div style={{ color: '#c9a227' }} className="text-2xl font-bold">$2.4B+</div>
                <div className="text-gray-400 text-xs">Assets Under Management</div>
              </div>
              <div className="text-center">
                <div style={{ color: '#c9a227' }} className="text-2xl font-bold">500K+</div>
                <div className="text-gray-400 text-xs">Happy Customers</div>
              </div>
              <div className="text-center">
                <div style={{ color: '#c9a227' }} className="text-2xl font-bold">29yrs</div>
                <div className="text-gray-400 text-xs">Years of Service</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div style={{ backgroundColor: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)' }} className="rounded-2xl p-8 w-80">
              <div className="text-center mb-6">
                <div style={{ backgroundColor: '#c9a227' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-2xl">USF</span>
                </div>
                <div className="text-white font-bold">Quick Access</div>
              </div>
              <div className="space-y-3">
                {['Check Balance', 'Transfer Funds', 'Pay Bills', 'Apply for Loan'].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3">
                    <CheckCircle size={16} style={{ color: '#c9a227' }} />
                    <span className="text-white text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: Shield, label: 'FDIC Insured', sub: 'Up to $250,000' },
            { icon: Lock, label: '256-bit SSL', sub: 'Bank-grade Security' },
            { icon: Star, label: 'A+ Rated', sub: 'BBB Accredited' },
            { icon: Users, label: '500K+ Customers', sub: 'Trusted Nationwide' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div style={{ backgroundColor: '#1e3a5f' }} className="w-10 h-10 rounded-full flex items-center justify-center">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{label}</div>
                <div className="text-gray-500 text-xs">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ color: '#1e3a5f' }} className="text-3xl font-bold mb-3">Our Banking Services</h2>
            <p className="text-gray-600">Everything you need for modern banking, all in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Personal Checking', desc: 'Zero-fee checking accounts with instant transfers and debit card access.', icon: '🏦' },
              { title: 'Savings Accounts', desc: 'High-yield savings with competitive interest rates up to 4.5% APY.', icon: '💰' },
              { title: 'Personal Loans', desc: 'Flexible personal loans from $1,000 to $50,000 with low interest rates.', icon: '📋' },
              { title: 'Fixed Deposits', desc: 'Lock in your money for guaranteed returns up to 6% per annum.', icon: '🔒' },
              { title: 'Wire Transfers', desc: 'Domestic and international wire transfers, fast and secure.', icon: '↗️' },
              { title: 'Bill Payments', desc: 'Pay all your bills — utilities, insurance, subscriptions — in one place.', icon: '📄' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 style={{ color: '#1e3a5f' }} className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose United State Federal Bank?</h2>
            <p className="text-gray-300">We've been serving Americans since 1995 with trust, integrity, and innovation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Secure Banking', desc: 'Bank-grade 256-bit SSL encryption, two-factor authentication, and real-time fraud monitoring.', icon: Lock },
              { title: 'Always Available', desc: '24/7 online banking, customer support, and instant transaction processing every day of the year.', icon: Phone },
              { title: 'Great Returns', desc: 'Competitive interest rates on savings, CDs, and investment accounts to grow your money.', icon: TrendingUp },
            ].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="text-center">
                <div style={{ backgroundColor: '#c9a227' }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 style={{ color: '#1e3a5f' }} className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join over 500,000 Americans who trust United State Federal Bank with their financial future.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" style={{ backgroundColor: '#c9a227' }} className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90">
              Open Free Account
            </Link>
            <Link to="/contact" style={{ color: '#1e3a5f', border: '2px solid #1e3a5f' }} className="px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
