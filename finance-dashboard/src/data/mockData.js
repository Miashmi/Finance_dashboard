export const CATEGORIES = [
  { id: 'food',        label: 'Food & Dining',    color: '#f59e0b', emoji: '🍔' },
  { id: 'transport',  label: 'Transport',         color: '#3b82f6', emoji: '🚗' },
  { id: 'shopping',   label: 'Shopping',          color: '#8b5cf6', emoji: '🛍️' },
  { id: 'utilities',  label: 'Utilities',         color: '#06b6d4', emoji: '⚡' },
  { id: 'health',     label: 'Health & Fitness',  color: '#10b981', emoji: '🏥' },
  { id: 'entertainment', label: 'Entertainment',  color: '#f43f5e', emoji: '🎬' },
  { id: 'salary',     label: 'Salary',            color: '#10b981', emoji: '💼' },
  { id: 'freelance',  label: 'Freelance',         color: '#34d399', emoji: '💻' },
  { id: 'investment', label: 'Investment Return', color: '#a3e635', emoji: '📈' },
  { id: 'education',  label: 'Education',         color: '#fb923c', emoji: '📚' },
  { id: 'subscriptions', label: 'Subscriptions',  color: '#c084fc', emoji: '📱' },
  { id: 'other',      label: 'Other',             color: '#94a3b8', emoji: '📦' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

let _nextId = 1;
const mkId = () => `txn_${String(_nextId++).padStart(4, '0')}`;

export const INITIAL_TRANSACTIONS = [
  // October 2024
  { id: mkId(), date: '2024-10-02', description: 'Monthly Salary', amount: 85000, type: 'income',  category: 'salary' },
  { id: mkId(), date: '2024-10-03', description: 'Swiggy — Dinner',  amount: 780,   type: 'expense', category: 'food' },
  { id: mkId(), date: '2024-10-05', description: 'Ola Cabs',         amount: 340,   type: 'expense', category: 'transport' },
  { id: mkId(), date: '2024-10-08', description: 'Amazon Shopping',  amount: 4200,  type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2024-10-10', description: 'Electricity Bill', amount: 1850,  type: 'expense', category: 'utilities' },
  { id: mkId(), date: '2024-10-12', description: 'Freelance Project A', amount: 22000, type: 'income', category: 'freelance' },
  { id: mkId(), date: '2024-10-15', description: 'Netflix + Spotify', amount: 899,  type: 'expense', category: 'subscriptions' },
  { id: mkId(), date: '2024-10-18', description: 'Gym Membership',   amount: 2500,  type: 'expense', category: 'health' },
  { id: mkId(), date: '2024-10-20', description: 'Movie — PVR',      amount: 600,   type: 'expense', category: 'entertainment' },
  { id: mkId(), date: '2024-10-25', description: 'Zerodha Dividends', amount: 3200, type: 'income',  category: 'investment' },
  { id: mkId(), date: '2024-10-28', description: 'Zomato — Lunch',   amount: 450,   type: 'expense', category: 'food' },

  // November 2024
  { id: mkId(), date: '2024-11-01', description: 'Monthly Salary',    amount: 85000, type: 'income',  category: 'salary' },
  { id: mkId(), date: '2024-11-04', description: 'BigBasket Grocery', amount: 3200,  type: 'expense', category: 'food' },
  { id: mkId(), date: '2024-11-06', description: 'Myntra — Clothes',  amount: 5800,  type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2024-11-09', description: 'Metro Card Recharge', amount: 500, type: 'expense', category: 'transport' },
  { id: mkId(), date: '2024-11-12', description: 'Udemy Course',      amount: 1299,  type: 'expense', category: 'education' },
  { id: mkId(), date: '2024-11-15', description: 'Freelance Project B', amount: 18000, type: 'income', category: 'freelance' },
  { id: mkId(), date: '2024-11-20', description: 'Doctor Consultation', amount: 1200, type: 'expense', category: 'health' },
  { id: mkId(), date: '2024-11-22', description: 'Water & Internet',  amount: 1400,  type: 'expense', category: 'utilities' },
  { id: mkId(), date: '2024-11-26', description: 'Concert Tickets',   amount: 3500,  type: 'expense', category: 'entertainment' },
  { id: mkId(), date: '2024-11-28', description: 'Swiggy — Weekend',  amount: 1200,  type: 'expense', category: 'food' },

  // December 2024
  { id: mkId(), date: '2024-12-02', description: 'Monthly Salary',   amount: 85000,  type: 'income',  category: 'salary' },
  { id: mkId(), date: '2024-12-05', description: 'Christmas Shopping', amount: 12000, type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2024-12-10', description: 'Flight Tickets',   amount: 8500,   type: 'expense', category: 'transport' },
  { id: mkId(), date: '2024-12-15', description: 'Year-end Bonus',   amount: 30000,  type: 'income',  category: 'salary' },
  { id: mkId(), date: '2024-12-18', description: 'Restaurant — Family', amount: 4200, type: 'expense', category: 'food' },
  { id: mkId(), date: '2024-12-22', description: 'Mutual Fund Return', amount: 5400, type: 'income',  category: 'investment' },
  { id: mkId(), date: '2024-12-26', description: 'Amazon Electronics', amount: 18000, type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2024-12-30', description: 'Year-end Party',   amount: 6000,   type: 'expense', category: 'entertainment' },

  // January 2025
  { id: mkId(), date: '2025-01-02', description: 'Monthly Salary',   amount: 88000,  type: 'income',  category: 'salary' },
  { id: mkId(), date: '2025-01-05', description: 'House Rent',       amount: 22000,  type: 'expense', category: 'utilities' },
  { id: mkId(), date: '2025-01-08', description: 'Zomato Pro Sub',   amount: 149,    type: 'expense', category: 'subscriptions' },
  { id: mkId(), date: '2025-01-10', description: 'Pharmacy',         amount: 890,    type: 'expense', category: 'health' },
  { id: mkId(), date: '2025-01-14', description: 'Freelance Project C', amount: 25000, type: 'income', category: 'freelance' },
  { id: mkId(), date: '2025-01-17', description: 'Petrol',           amount: 3000,   type: 'expense', category: 'transport' },
  { id: mkId(), date: '2025-01-20', description: 'Online Course',    amount: 2999,   type: 'expense', category: 'education' },
  { id: mkId(), date: '2025-01-24', description: 'BigBasket',        amount: 4500,   type: 'expense', category: 'food' },
  { id: mkId(), date: '2025-01-28', description: 'OTT Bundle',       amount: 1299,   type: 'expense', category: 'subscriptions' },

  // February 2025
  { id: mkId(), date: '2025-02-01', description: 'Monthly Salary',   amount: 88000,  type: 'income',  category: 'salary' },
  { id: mkId(), date: '2025-02-05', description: 'House Rent',       amount: 22000,  type: 'expense', category: 'utilities' },
  { id: mkId(), date: '2025-02-08', description: "Valentine's Dinner", amount: 3200, type: 'expense', category: 'food' },
  { id: mkId(), date: '2025-02-10', description: 'New Shoes — Nike', amount: 8500,   type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2025-02-12', description: 'Stock Dividends',  amount: 4100,   type: 'income',  category: 'investment' },
  { id: mkId(), date: '2025-02-15', description: 'Rapido — Daily',   amount: 1800,   type: 'expense', category: 'transport' },
  { id: mkId(), date: '2025-02-18', description: 'Netflix',          amount: 649,    type: 'expense', category: 'subscriptions' },
  { id: mkId(), date: '2025-02-22', description: 'Gym Renewal',      amount: 6000,   type: 'expense', category: 'health' },
  { id: mkId(), date: '2025-02-26', description: 'Book Store',       amount: 1200,   type: 'expense', category: 'education' },

  // March 2025
  { id: mkId(), date: '2025-03-01', description: 'Monthly Salary',   amount: 88000,  type: 'income',  category: 'salary' },
  { id: mkId(), date: '2025-03-03', description: 'House Rent',       amount: 22000,  type: 'expense', category: 'utilities' },
  { id: mkId(), date: '2025-03-06', description: 'Freelance Project D', amount: 32000, type: 'income', category: 'freelance' },
  { id: mkId(), date: '2025-03-09', description: 'Grocery — DMart',  amount: 5600,   type: 'expense', category: 'food' },
  { id: mkId(), date: '2025-03-12', description: 'IRCTC Tickets',    amount: 2400,   type: 'expense', category: 'transport' },
  { id: mkId(), date: '2025-03-15', description: 'Amazon Prime',     amount: 1499,   type: 'expense', category: 'subscriptions' },
  { id: mkId(), date: '2025-03-18', description: 'Medical Check-up', amount: 3500,   type: 'expense', category: 'health' },
  { id: mkId(), date: '2025-03-22', description: 'IPL Tickets',      amount: 5000,   type: 'expense', category: 'entertainment' },
  { id: mkId(), date: '2025-03-25', description: 'Mutual Fund SIP',  amount: 10000,  type: 'expense', category: 'investment' },
  { id: mkId(), date: '2025-03-28', description: 'Clothing — H&M',   amount: 4200,   type: 'expense', category: 'shopping' },
  { id: mkId(), date: '2025-03-30', description: 'Investment Return', amount: 6800,  type: 'income',  category: 'investment' },
];

export const getNextId = () => `txn_${String(_nextId++).padStart(4, '0')}`;

export const MONTHS = [
  'Oct 2024','Nov 2024','Dec 2024','Jan 2025','Feb 2025','Mar 2025',
];

export const MONTH_KEYS = [
  '2024-10','2024-11','2024-12','2025-01','2025-02','2025-03',
];