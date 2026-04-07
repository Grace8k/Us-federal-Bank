import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CreditCard, Lock, Unlock, Plus } from 'lucide-react'

export const Route = createFileRoute('/dashboard/cards')({
  component: CardsPage,
})

function CardsPage() {
  const { currentUser, cards, updateCardStatus, addCard } = useBankingStore()
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userCards = cards.filter(c => c.userId === currentUser.id)

  const handleRequestCard = () => {
    const cardNum = `4${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}`
    const exp = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${new Date().getFullYear() + 3 - 2000}`
    addCard({
      userId: currentUser.id,
      cardNumber: cardNum,
      cardHolder: currentUser.name.toUpperCase(),
      expiryDate: exp,
      cvv: String(Math.floor(100 + Math.random() * 900)),
      type: 'debit',
      status: 'active',
      limit: 5000,
    })
    setShowForm(false)
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>My Cards</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#c9a227' }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90">
            <Plus size={16} /> Request New Card
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Request New Debit Card</h3>
            <p className="text-gray-600 text-sm mb-4">A new virtual debit card will be issued to your account. Physical card delivery takes 7-10 business days.</p>
            <div className="flex gap-3">
              <button onClick={handleRequestCard} style={{ backgroundColor: '#1e3a5f' }} className="px-6 py-2.5 rounded-lg text-white font-semibold hover:opacity-90">Confirm Request</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {userCards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CreditCard size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No cards yet. Request your first card above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCards.map(card => (
              <div key={card.id}>
                {/* Card visual */}
                <div style={{ background: card.status === 'blocked' ? 'linear-gradient(135deg, #6b7280 0%, #374151 100%)' : 'linear-gradient(135deg, #1e3a5f 0%, #0d2040 100%)' }}
                  className="rounded-2xl p-6 text-white shadow-lg mb-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#c9a227', transform: 'translate(30%, -30%)' }} />
                  <div className="flex justify-between items-start mb-8">
                    <div style={{ backgroundColor: '#c9a227' }} className="w-10 h-8 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">USF</span>
                    </div>
                    <span className="text-xs uppercase tracking-wider">{card.type}</span>
                  </div>
                  <div className="font-mono text-xl mb-4 tracking-widest">{card.cardNumber}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-blue-300">Card Holder</div>
                      <div className="font-semibold tracking-wider">{card.cardHolder}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-300">Expires</div>
                      <div className="font-semibold">{card.expiryDate}</div>
                    </div>
                  </div>
                  {card.status === 'blocked' && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-2xl">
                      <div className="bg-red-500 text-white px-6 py-2 rounded font-bold rotate-12">BLOCKED</div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">CVV: <span className="font-mono">{card.cvv}</span></div>
                    <div className="text-xs text-gray-500">Limit: ${card.limit.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => updateCardStatus(card.id, card.status === 'active' ? 'blocked' : 'active')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${card.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {card.status === 'active' ? <><Lock size={14} /> Block Card</> : <><Unlock size={14} /> Unblock</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
