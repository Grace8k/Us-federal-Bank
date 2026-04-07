import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-300">We're here to help. Reach out anytime.</p>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 style={{ color: '#1e3a5f' }} className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-6">
            {[
              { icon: Phone, title: 'Phone', info: '1-800-USFBANK (1-800-873-2265)', sub: 'Available 24/7' },
              { icon: Mail, title: 'Email', info: 'support@unitedstatefederal.com', sub: 'Response within 24 hours' },
              { icon: MapPin, title: 'Headquarters', info: '100 Federal Plaza, New York, NY 10007', sub: 'Mon-Fri 9am-5pm ET' },
              { icon: Clock, title: 'Hours', info: 'Online Banking: 24/7', sub: 'Branch: Mon-Fri 9am-5pm' },
            ].map(({ icon: Icon, title, info, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div style={{ backgroundColor: '#1e3a5f' }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{title}</div>
                  <div className="text-gray-700">{info}</div>
                  <div className="text-gray-500 text-sm">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
              <p className="text-gray-600">Thank you for reaching out. We'll respond within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} style={{ color: '#c9a227' }} className="mt-4 font-semibold hover:underline">Send Another Message</button>
            </div>
          ) : (
            <>
              <h3 style={{ color: '#1e3a5f' }} className="text-xl font-bold mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your full name' },
                  { label: 'Email', field: 'email', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Subject', field: 'subject', type: 'text', placeholder: 'How can we help?' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} required value={(form as Record<string, string>)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder={placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" style={{ backgroundColor: '#1e3a5f' }} className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90">
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
