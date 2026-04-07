import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserStatus = 'active' | 'suspended' | 'closed'
export type KycStatus = 'pending' | 'verified' | 'rejected'
export type AccountType = 'checking' | 'savings'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'bill_payment' | 'airtime' | 'wire_transfer' | 'loan_disbursement' | 'loan_repayment' | 'fixed_deposit'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'paid'
export type CardStatus = 'active' | 'blocked' | 'expired'
export type NotifType = 'info' | 'success' | 'warning' | 'error'

export interface BankUser {
  id: string
  name: string
  email: string
  phone: string
  ssnLast4: string
  address: string
  password: string
  balance: number
  accountNumber: string
  accountType: AccountType
  status: UserStatus
  createdAt: string
  kycStatus: KycStatus
  role: 'user'
}

export interface Transaction {
  id: string
  fromUserId: string
  toUserId: string
  type: TransactionType
  amount: number
  description: string
  status: TransactionStatus
  date: string
  category: string
}

export interface Loan {
  id: string
  userId: string
  amount: number
  interestRate: number
  term: number
  monthlyPayment: number
  balance: number
  status: LoanStatus
  purpose: string
  createdAt: string
  approvedAt?: string
}

export interface Card {
  id: string
  userId: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  type: 'debit' | 'credit'
  status: CardStatus
  limit: number
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotifType
  read: boolean
  createdAt: string
}

export interface Beneficiary {
  id: string
  userId: string
  name: string
  accountNumber: string
  bankName: string
  email: string
  createdAt: string
}

export interface AdminLog {
  id: string
  adminEmail: string
  action: string
  targetUserId?: string
  details: string
  createdAt: string
}

export interface SystemSettings {
  bankName: string
  maintenanceFee: number
  wireTransferFee: number
  exchangeRates: Record<string, number>
}

export interface FixedDeposit {
  id: string
  userId: string
  amount: number
  interestRate: number
  term: number
  maturityDate: string
  status: 'active' | 'matured' | 'withdrawn'
  createdAt: string
}

interface BankingState {
  users: BankUser[]
  currentUser: BankUser | null
  transactions: Transaction[]
  loans: Loan[]
  cards: Card[]
  notifications: Notification[]
  beneficiaries: Beneficiary[]
  adminLogs: AdminLog[]
  fixedDeposits: FixedDeposit[]
  systemSettings: SystemSettings

  // Auth actions
  login: (email: string, password: string) => { success: boolean; role?: string; error?: string }
  logout: () => void
  register: (data: Omit<BankUser, 'id' | 'balance' | 'accountNumber' | 'createdAt' | 'kycStatus' | 'role' | 'status'>) => { success: boolean; error?: string }

  // User actions
  updateProfile: (userId: string, data: Partial<BankUser>) => void
  updateBalance: (userId: string, amount: number) => void

  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void
  updateTransactionStatus: (txId: string, status: TransactionStatus) => void

  // Transfer
  sendMoney: (fromUserId: string, toAccountNumber: string, amount: number, description: string) => { success: boolean; error?: string }

  // Loan actions
  applyLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'status' | 'balance' | 'monthlyPayment'>) => void
  updateLoanStatus: (loanId: string, status: LoanStatus) => void

  // Card actions
  addCard: (card: Omit<Card, 'id' | 'createdAt'>) => void
  updateCardStatus: (cardId: string, status: CardStatus) => void

  // Notification actions
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (notifId: string) => void
  markAllNotificationsRead: (userId: string) => void

  // Beneficiary actions
  addBeneficiary: (ben: Omit<Beneficiary, 'id' | 'createdAt'>) => void
  deleteBeneficiary: (benId: string) => void

  // Admin actions
  adminUpdateUser: (userId: string, data: Partial<BankUser>, adminEmail: string) => void
  adminAddFunds: (userId: string, amount: number, adminEmail: string) => void
  adminDeductFunds: (userId: string, amount: number, adminEmail: string) => void
  adminLogAction: (log: Omit<AdminLog, 'id' | 'createdAt'>) => void

  // Fixed deposit
  addFixedDeposit: (fd: Omit<FixedDeposit, 'id' | 'createdAt'>) => void

  // Bill payment
  payBill: (userId: string, billType: string, amount: number, accountRef: string) => { success: boolean; error?: string }

  // Airtime
  buyAirtime: (userId: string, phone: string, amount: number, network: string) => { success: boolean; error?: string }
}

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString()

const initialUser: BankUser = {
  id: 'user_001',
  name: 'John Smith',
  email: 'testuser@email.com',
  phone: '(555) 123-4567',
  ssnLast4: '4321',
  address: '123 Main St, New York, NY 10001',
  password: 'TestUser@123',
  balance: 5000,
  accountNumber: '1234567890',
  accountType: 'checking',
  status: 'active',
  createdAt: '2024-01-15T10:00:00Z',
  kycStatus: 'verified',
  role: 'user',
}

const initialTransactions: Transaction[] = [
  { id: 'tx_001', fromUserId: 'user_001', toUserId: 'external', type: 'withdrawal', amount: 200, description: 'ATM Withdrawal', status: 'completed', date: '2025-04-01T10:00:00Z', category: 'Cash' },
  { id: 'tx_002', fromUserId: 'external', toUserId: 'user_001', type: 'deposit', amount: 3000, description: 'Salary Deposit', status: 'completed', date: '2025-03-28T09:00:00Z', category: 'Income' },
  { id: 'tx_003', fromUserId: 'user_001', toUserId: 'external', type: 'bill_payment', amount: 150, description: 'Electricity Bill', status: 'completed', date: '2025-03-25T14:00:00Z', category: 'Utilities' },
  { id: 'tx_004', fromUserId: 'user_001', toUserId: 'external', type: 'transfer', amount: 500, description: 'Rent Payment', status: 'completed', date: '2025-03-20T11:00:00Z', category: 'Housing' },
  { id: 'tx_005', fromUserId: 'external', toUserId: 'user_001', type: 'deposit', amount: 250, description: 'Freelance Payment', status: 'completed', date: '2025-03-18T16:00:00Z', category: 'Income' },
]

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => ({
      users: [initialUser],
      currentUser: null,
      transactions: initialTransactions,
      loans: [],
      cards: [
        {
          id: 'card_001',
          userId: 'user_001',
          cardNumber: '4532 1234 5678 9012',
          cardHolder: 'JOHN SMITH',
          expiryDate: '12/27',
          cvv: '123',
          type: 'debit',
          status: 'active',
          limit: 5000,
          createdAt: '2024-01-15T10:00:00Z',
        },
      ],
      notifications: [
        {
          id: 'notif_001',
          userId: 'user_001',
          title: 'Welcome to United State Federal Bank',
          message: 'Your account has been successfully created. Start banking with confidence!',
          type: 'success',
          read: false,
          createdAt: '2024-01-15T10:00:00Z',
        },
      ],
      beneficiaries: [],
      adminLogs: [],
      fixedDeposits: [],
      systemSettings: {
        bankName: 'United State Federal Bank',
        maintenanceFee: 5,
        wireTransferFee: 25,
        exchangeRates: {
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          CAD: 1.36,
          JPY: 149.5,
          AUD: 1.53,
          CHF: 0.89,
          CNY: 7.24,
        },
      },

      login: (email, password) => {
        // Admin check
        if (email === 'admin@unitedstatebank.com' && password === 'USBank@Admin2024#') {
          return { success: true, role: 'admin' }
        }
        const { users } = get()
        const user = users.find(u => u.email === email && u.password === password)
        if (!user) return { success: false, error: 'Invalid email or password' }
        if (user.status === 'suspended') return { success: false, error: 'Your account has been suspended. Please contact support.' }
        if (user.status === 'closed') return { success: false, error: 'This account has been closed.' }
        set({ currentUser: user })
        return { success: true, role: 'user' }
      },

      logout: () => set({ currentUser: null }),

      register: (data) => {
        const { users } = get()
        if (users.find(u => u.email === data.email)) {
          return { success: false, error: 'Email already registered' }
        }
        const newUser: BankUser = {
          ...data,
          id: 'user_' + generateId(),
          balance: 0,
          accountNumber: generateAccountNumber(),
          status: 'active',
          createdAt: new Date().toISOString(),
          kycStatus: 'pending',
          role: 'user',
        }
        set(state => ({ users: [...state.users, newUser], currentUser: newUser }))
        return { success: true }
      },

      updateProfile: (userId, data) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, ...data } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser,
        }))
      },

      updateBalance: (userId, amount) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, balance: state.currentUser.balance + amount } : state.currentUser,
        }))
      },

      addTransaction: (tx) => {
        const newTx: Transaction = { ...tx, id: 'tx_' + generateId(), date: new Date().toISOString() }
        set(state => ({ transactions: [newTx, ...state.transactions] }))
      },

      updateTransactionStatus: (txId, status) => {
        set(state => ({
          transactions: state.transactions.map(t => t.id === txId ? { ...t, status } : t),
        }))
      },

      sendMoney: (fromUserId, toAccountNumber, amount, description) => {
        const state = get()
        const fromUser = state.users.find(u => u.id === fromUserId)
        const toUser = state.users.find(u => u.accountNumber === toAccountNumber)
        if (!fromUser) return { success: false, error: 'Sender not found' }
        if (!toUser) return { success: false, error: 'Recipient account not found' }
        if (fromUser.balance < amount) return { success: false, error: 'Insufficient balance' }
        if (amount <= 0) return { success: false, error: 'Invalid amount' }

        get().updateBalance(fromUserId, -amount)
        get().updateBalance(toUser.id, amount)
        get().addTransaction({ fromUserId, toUserId: toUser.id, type: 'transfer', amount, description, status: 'completed', category: 'Transfer' })
        get().addNotification({ userId: fromUserId, title: 'Transfer Successful', message: `$${amount.toFixed(2)} sent to ${toUser.name}`, type: 'success', read: false })
        get().addNotification({ userId: toUser.id, title: 'Money Received', message: `$${amount.toFixed(2)} received from ${fromUser.name}`, type: 'success', read: false })
        return { success: true }
      },

      applyLoan: (loan) => {
        const monthly = (loan.amount * (loan.interestRate / 100 / 12)) / (1 - Math.pow(1 + loan.interestRate / 100 / 12, -loan.term))
        const newLoan: Loan = { ...loan, id: 'loan_' + generateId(), status: 'pending', createdAt: new Date().toISOString(), balance: loan.amount, monthlyPayment: Math.round(monthly * 100) / 100 }
        set(state => ({ loans: [...state.loans, newLoan] }))
        get().addNotification({ userId: loan.userId, title: 'Loan Application Received', message: `Your loan application for $${loan.amount.toFixed(2)} has been submitted for review.`, type: 'info', read: false })
      },

      updateLoanStatus: (loanId, status) => {
        const state = get()
        const loan = state.loans.find(l => l.id === loanId)
        if (!loan) return
        set(s => ({ loans: s.loans.map(l => l.id === loanId ? { ...l, status, approvedAt: status === 'approved' ? new Date().toISOString() : l.approvedAt } : l) }))
        if (status === 'approved') {
          get().updateBalance(loan.userId, loan.amount)
          get().addTransaction({ fromUserId: 'bank', toUserId: loan.userId, type: 'loan_disbursement', amount: loan.amount, description: 'Loan Disbursement', status: 'completed', category: 'Loan' })
          get().addNotification({ userId: loan.userId, title: 'Loan Approved!', message: `Your loan of $${loan.amount.toFixed(2)} has been approved and credited to your account.`, type: 'success', read: false })
        } else if (status === 'rejected') {
          get().addNotification({ userId: loan.userId, title: 'Loan Application Update', message: 'Unfortunately, your loan application has been rejected. Please contact support for more information.', type: 'error', read: false })
        }
      },

      addCard: (card) => {
        const newCard: Card = { ...card, id: 'card_' + generateId(), createdAt: new Date().toISOString() }
        set(state => ({ cards: [...state.cards, newCard] }))
      },

      updateCardStatus: (cardId, status) => {
        set(state => ({ cards: state.cards.map(c => c.id === cardId ? { ...c, status } : c) }))
      },

      addNotification: (notif) => {
        const newNotif: Notification = { ...notif, id: 'notif_' + generateId(), createdAt: new Date().toISOString() }
        set(state => ({ notifications: [newNotif, ...state.notifications] }))
      },

      markNotificationRead: (notifId) => {
        set(state => ({ notifications: state.notifications.map(n => n.id === notifId ? { ...n, read: true } : n) }))
      },

      markAllNotificationsRead: (userId) => {
        set(state => ({ notifications: state.notifications.map(n => n.userId === userId ? { ...n, read: true } : n) }))
      },

      addBeneficiary: (ben) => {
        const newBen: Beneficiary = { ...ben, id: 'ben_' + generateId(), createdAt: new Date().toISOString() }
        set(state => ({ beneficiaries: [...state.beneficiaries, newBen] }))
      },

      deleteBeneficiary: (benId) => {
        set(state => ({ beneficiaries: state.beneficiaries.filter(b => b.id !== benId) }))
      },

      adminUpdateUser: (userId, data, adminEmail) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, ...data } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser,
        }))
        get().adminLogAction({ adminEmail, action: 'UPDATE_USER', targetUserId: userId, details: `Updated user fields: ${Object.keys(data).join(', ')}` })
      },

      adminAddFunds: (userId, amount, adminEmail) => {
        get().updateBalance(userId, amount)
        const user = get().users.find(u => u.id === userId)
        get().addTransaction({ fromUserId: 'admin', toUserId: userId, type: 'deposit', amount, description: 'Admin Fund Credit', status: 'completed', category: 'Admin' })
        get().addNotification({ userId, title: 'Funds Added', message: `$${amount.toFixed(2)} has been credited to your account by administration.`, type: 'success', read: false })
        get().adminLogAction({ adminEmail, action: 'ADD_FUNDS', targetUserId: userId, details: `Added $${amount} to ${user?.name || userId}'s account` })
      },

      adminDeductFunds: (userId, amount, adminEmail) => {
        const user = get().users.find(u => u.id === userId)
        if (user && user.balance >= amount) {
          get().updateBalance(userId, -amount)
          get().addTransaction({ fromUserId: userId, toUserId: 'admin', type: 'withdrawal', amount, description: 'Admin Fund Deduction', status: 'completed', category: 'Admin' })
          get().addNotification({ userId, title: 'Account Deduction', message: `$${amount.toFixed(2)} has been debited from your account by administration.`, type: 'warning', read: false })
          get().adminLogAction({ adminEmail, action: 'DEDUCT_FUNDS', targetUserId: userId, details: `Deducted $${amount} from ${user?.name || userId}'s account` })
        }
      },

      adminLogAction: (log) => {
        const newLog: AdminLog = { ...log, id: 'log_' + generateId(), createdAt: new Date().toISOString() }
        set(state => ({ adminLogs: [newLog, ...state.adminLogs] }))
      },

      addFixedDeposit: (fd) => {
        const newFd: FixedDeposit = { ...fd, id: 'fd_' + generateId(), createdAt: new Date().toISOString() }
        set(state => ({ fixedDeposits: [...state.fixedDeposits, newFd] }))
      },

      payBill: (userId, billType, amount, accountRef) => {
        const user = get().users.find(u => u.id === userId)
        if (!user) return { success: false, error: 'User not found' }
        if (user.balance < amount) return { success: false, error: 'Insufficient balance' }
        get().updateBalance(userId, -amount)
        get().addTransaction({ fromUserId: userId, toUserId: 'external', type: 'bill_payment', amount, description: `${billType} - Ref: ${accountRef}`, status: 'completed', category: 'Bills' })
        get().addNotification({ userId, title: 'Bill Payment Successful', message: `$${amount.toFixed(2)} paid for ${billType}`, type: 'success', read: false })
        return { success: true }
      },

      buyAirtime: (userId, phone, amount, network) => {
        const user = get().users.find(u => u.id === userId)
        if (!user) return { success: false, error: 'User not found' }
        if (user.balance < amount) return { success: false, error: 'Insufficient balance' }
        get().updateBalance(userId, -amount)
        get().addTransaction({ fromUserId: userId, toUserId: 'external', type: 'airtime', amount, description: `${network} Airtime - ${phone}`, status: 'completed', category: 'Airtime' })
        get().addNotification({ userId, title: 'Airtime Purchase Successful', message: `$${amount.toFixed(2)} airtime purchased for ${phone}`, type: 'success', read: false })
        return { success: true }
      },
    }),
    {
      name: 'usfb-banking-store',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        transactions: state.transactions,
        loans: state.loans,
        cards: state.cards,
        notifications: state.notifications,
        beneficiaries: state.beneficiaries,
        adminLogs: state.adminLogs,
        fixedDeposits: state.fixedDeposits,
        systemSettings: state.systemSettings,
      }),
    }
  )
)
