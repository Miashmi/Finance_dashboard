import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, getNextId } from '../data/mockData';

// ─── State Shape ─────────────────────────────────────────────────────────────
const initialState = {
  transactions: [],
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    month: 'all',
    sortBy: 'date-desc',
  },
  role: 'admin',        // 'admin' | 'viewer'
  activePage: 'dashboard',
  modalOpen: false,
  editingTransaction: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'INIT_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        modalOpen: false,
        editingTransaction: null,
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        modalOpen: false,
        editingTransaction: null,
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { search: '', category: 'all', type: 'all', month: 'all', sortBy: 'date-desc' },
      };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_PAGE':
      return { ...state, activePage: action.payload };

    case 'OPEN_MODAL':
      return { ...state, modalOpen: true, editingTransaction: action.payload || null };

    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, editingTransaction: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage or seed with mock data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('finlens_transactions');
      if (stored) {
        dispatch({ type: 'INIT_TRANSACTIONS', payload: JSON.parse(stored) });
      } else {
        dispatch({ type: 'INIT_TRANSACTIONS', payload: INITIAL_TRANSACTIONS });
      }
    } catch {
      dispatch({ type: 'INIT_TRANSACTIONS', payload: INITIAL_TRANSACTIONS });
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem('finlens_transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions]);

  // ─── Derived Data ───────────────────────────────────────────────────────────
  const getFilteredTransactions = useCallback(() => {
    let list = [...state.transactions];
    const { search, category, type, month, sortBy } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q));
    }
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (type !== 'all')     list = list.filter((t) => t.type === type);
    if (month !== 'all')    list = list.filter((t) => t.date.startsWith(month));

    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':   return new Date(b.date) - new Date(a.date);
        case 'date-asc':    return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc':  return a.amount - b.amount;
        default: return 0;
      }
    });

    return list;
  }, [state.transactions, state.filters]);

  const getSummary = useCallback(() => {
    const income  = state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [state.transactions]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const addTransaction = useCallback((data) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...data, id: getNextId() },
    });
  }, []);

  const updateTransaction = useCallback((data) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: data });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const setFilter = useCallback((filters) => {
    dispatch({ type: 'SET_FILTER', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const openModal = useCallback((transaction = null) => {
    dispatch({ type: 'OPEN_MODAL', payload: transaction });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (₹)'];
    const rows = state.transactions.map((t) => [
      t.id, t.date, `"${t.description}"`, t.category, t.type, t.amount,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'finlens_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.transactions]);

  const value = {
    ...state,
    getFilteredTransactions,
    getSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
    resetFilters,
    setRole,
    setPage,
    openModal,
    closeModal,
    exportCSV,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};