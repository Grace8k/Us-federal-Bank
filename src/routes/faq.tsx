import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const Route = createFileRoute('/faq')({
  component: FaqPage,
})

const faqs = [
  { q: 'How do I open an account?', a: 'Click "Open Account" on our homepage, fill in your personal details including name, email, phone, address, and SSN last 4 digits. Your account will be created instantly with a unique account number.' },
  { q: 'Is my money FDIC insured?', a: 'Yes! All deposits at United State Federal Bank are insured by the FDIC up to $250,000 per depositor, per ownership category. Your money is completely safe.' },
  { q: 'How do I transfer money?', a: 'Log in to your online banking account, navigate to "Send Money" or "Transfers", enter the recipient\'s account number, the amount, and a description. Transfers within our bank are instant.' },
  { q: 'What are the fees?', a: 'We pride ourselves on low fees. There\'s a $5/month account maintenance fee, $25 for wire transfers, and no fees for standard transfers between accounts.' },
  { q: 'How do I apply for a loan?', a: 'Log in and navigate to "Loans" in your dashboard. Fill out the loan application form with the amount, purpose, and preferred term. Our team will review and respond within 1-2 business days.' },
  { q: 'Is online banking secure?', a: 'Absolutely. We use 256-bit SSL encryption, multi-factor authentication, and real-time fraud monitoring to keep your account safe 24/7.' },
  { q: 'How do I reset my password?', a: 'On the login page, click "Forgot Password". Enter your registered email address and we\'ll send you a password reset link within minutes.' },
  { q: 'Can I pay bills online?', a: 'Yes! Our Bill Pay feature allows you to pay utilities (electric, gas, water), insurance, internet, phone, and more directly from your account.' },
  { q: 'What is a Fixed Deposit?', a: 'A Fixed Deposit (CD) allows you to deposit money for a fixed term (3, 6, 12, or 24 months) at a guaranteed interest rate of up to 6% per annum.' },
  { q: 'How do I contact customer support?', a: 'You can reach us 24/7 at 1-800-USFBANK, email us at support@unitedstatefederal.com, or use the Support section in your dashboard to submit a ticket.' },
]

function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-300">Find quick answers to common questions about our banking services.</p>
      </div>

      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span style={{ color: '#1e3a5f' }} className="font-semibold">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
