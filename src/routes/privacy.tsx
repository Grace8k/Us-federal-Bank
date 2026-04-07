import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/PublicLayout'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#1e3a5f' }} className="py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-gray-300">Last updated: January 1, 2025</p>
      </div>
      <div className="max-w-4xl mx-auto py-16 px-4">
        {[
          { title: '1. Information We Collect', content: 'We collect personal identification information (name, email, phone, SSN last 4 digits, address), financial information (account numbers, transaction history), and technical information (IP address, browser type, device information) when you use our services.' },
          { title: '2. How We Use Your Information', content: 'We use your information to process transactions, verify your identity, provide customer support, detect and prevent fraud, comply with legal and regulatory requirements, and improve our services.' },
          { title: '3. Information Sharing', content: 'We do not sell your personal information. We may share information with: FDIC and regulatory authorities as required, fraud prevention services, credit bureaus, and third-party service providers under strict confidentiality agreements.' },
          { title: '4. Data Security', content: 'We implement 256-bit SSL encryption, multi-factor authentication, regular security audits, and strict access controls. We follow industry best practices to protect your data from unauthorized access, alteration, or disclosure.' },
          { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time. You can request a copy of your data by contacting us at privacy@unitedstatefederal.com.' },
          { title: '6. Cookies', content: 'We use essential cookies for authentication and security. We may use analytics cookies to improve our website. You can control cookies through your browser settings.' },
          { title: '7. Data Retention', content: 'We retain your account information for 7 years after account closure as required by federal banking regulations. Transaction records are kept for 5 years.' },
          { title: '8. Contact Us', content: 'For privacy concerns, contact our Data Protection Officer at privacy@unitedstatefederal.com or write to: United State Federal Bank, Privacy Department, 100 Federal Plaza, New York, NY 10007.' },
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
