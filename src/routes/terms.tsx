import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-gray-300">Last updated: January 1, 2025</p>
      </div>
      <div className="max-w-4xl mx-auto py-16 px-4 prose prose-gray">
        {[
          { title: '1. Acceptance of Terms', content: 'By opening an account or using the services of United State Federal Bank ("Bank"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.' },
          { title: '2. Account Eligibility', content: 'To open an account, you must be at least 18 years old, a US resident, and provide accurate personal information including a valid Social Security Number. We reserve the right to verify your identity and decline applications.' },
          { title: '3. Account Security', content: 'You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized access or security breach. We are not liable for losses from unauthorized access caused by your failure to protect your credentials.' },
          { title: '4. Fees and Charges', content: 'Account maintenance fee: $5/month. Wire transfer fee: $25 per transaction. Overdraft fee: $35 per occurrence. Fee schedules are subject to change with 30 days advance notice.' },
          { title: '5. Funds and Deposits', content: 'All deposits are FDIC insured up to $250,000 per depositor, per ownership category. Funds deposited may have a hold period of 1-5 business days before becoming available.' },
          { title: '6. Transfers and Payments', content: 'You may only transfer funds to verified accounts. We reserve the right to hold, delay, or reverse any transaction we deem suspicious or fraudulent. Responsibility for erroneous transfers lies with the account holder.' },
          { title: '7. Termination', content: 'We reserve the right to suspend or close accounts that violate these terms, engage in fraudulent activity, or fail to maintain minimum balance requirements. You may close your account at any time by contacting us.' },
          { title: '8. Privacy', content: 'Our use of your personal information is governed by our Privacy Policy, which is incorporated herein by reference. We use industry-standard encryption to protect your data.' },
          { title: '9. Governing Law', content: 'These terms are governed by the laws of the State of New York and applicable federal banking regulations. Any disputes shall be resolved through binding arbitration in New York City, NY.' },
        ].map(({ title, content }) => (
          <div key={title} className="mb-8">
            <h2 style={{ color: '#1e3a5f' }} className="text-xl font-bold mb-3">{title}</h2>
            <p className="text-gray-600">{content}</p>
          </div>
        ))}
      </div>
    </PublicLayout>
  )
}
