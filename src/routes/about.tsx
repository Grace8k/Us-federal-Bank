import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">About United State Federal Bank</h1>
        <p style={{ color: '#c9a227' }} className="text-lg">Your Trusted Banking Partner Since 1995</p>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 style={{ color: '#1e3a5f' }} className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 1995, United State Federal Bank started as a small community bank with a big mission: to provide every American with access to fair, transparent, and reliable banking services.
            </p>
            <p className="text-gray-600 mb-4">
              Over nearly three decades, we've grown to serve over 500,000 customers across all 50 states, managing over $2.4 billion in assets while maintaining our commitment to community banking values.
            </p>
            <p className="text-gray-600">
              We are FDIC insured, Equal Housing Lenders, and regulated by the Office of the Comptroller of the Currency (OCC), ensuring the highest standards of financial security and customer protection.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Founded', value: '1995' },
              { label: 'Customers', value: '500,000+' },
              { label: 'Assets Under Management', value: '$2.4 Billion+' },
              { label: 'States Served', value: 'All 50 States' },
              { label: 'FDIC Insurance', value: 'Up to $250,000' },
              { label: 'Customer Satisfaction', value: '4.8/5 Stars' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-600">{label}</span>
                <span style={{ color: '#1e3a5f' }} className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Our Mission', desc: 'To empower every American with accessible, secure, and innovative banking solutions that help them achieve their financial goals.' },
            { title: 'Our Vision', desc: 'To be the most trusted bank in America, known for exceptional customer service, financial innovation, and community impact.' },
            { title: 'Our Values', desc: 'Integrity, transparency, innovation, and community — these principles guide every decision we make for our customers.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ borderTop: '4px solid #c9a227' }} className="bg-white rounded-xl shadow-sm p-6">
              <h3 style={{ color: '#1e3a5f' }} className="font-bold text-lg mb-3">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
