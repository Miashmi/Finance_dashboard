import { useState } from 'react';
import { Search, SlidersHorizontal, Trash2, Pencil, ArrowUpDown, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, MONTH_KEYS } from '../data/mockData';

const MONTHS_OPTIONS = [
  { value: 'all', label: 'All Months' },
  { value: '2024-10', label: 'Oct 2024' },
  { value: '2024-11', label: 'Nov 2024' },
  { value: '2024-12', label: 'Dec 2024' },
  { value: '2025-01', label: 'Jan 2025' },
  { value: '2025-02', label: 'Feb 2025' },
  { value: '2025-03', label: 'Mar 2025' },
];

function fmt(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}
function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function TransactionList() {
  const { filters, setFilter, resetFilters, getFilteredTransactions, role, openModal, deleteTransaction } =
    useApp();
  const [showFilters, setShowFilters] = useState(false);

  const transactions = getFilteredTransactions();
  const activeFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.month !== 'all';

  return (
    <div className="card animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4a5a7a' }} />
          <input
            type="text"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="input pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`btn-secondary ${showFilters ? 'border-emerald-500/40 text-emerald-400' : ''}`}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilters && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value })}
            className="select"
            style={{ maxWidth: 160 }}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-2xl border"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: '#3a4a6a' }}>
              Category
            </label>
            <select value={filters.category} onChange={(e) => setFilter({ category: e.target.value })} className="select">
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: '#3a4a6a' }}>
              Type
            </label>
            <select value={filters.type} onChange={(e) => setFilter({ type: e.target.value })} className="select">
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: '#3a4a6a' }}>
              Month
            </label>
            <select value={filters.month} onChange={(e) => setFilter({ month: e.target.value })} className="select">
              {MONTHS_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {activeFilters && (
            <div className="sm:col-span-3">
              <button onClick={resetFilters} className="btn-secondary text-xs">
                <X size={12} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: '#3a4a6a' }}>
        Showing <span className="text-white font-semibold">{transactions.length}</span> transaction{transactions.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-white">No results found</p>
          <p className="text-xs mt-1.5" style={{ color: '#4a5a7a' }}>Try adjusting your search or filters</p>
          {activeFilters && (
            <button onClick={resetFilters} className="btn-secondary mt-4 mx-auto text-xs">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Description', 'Category', 'Type', 'Amount', role === 'admin' ? 'Actions' : ''].map((h) =>
                    h ? (
                      <th
                        key={h}
                        className="text-left pb-3 px-3 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: '#3a4a6a' }}
                      >
                        {h}
                      </th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => {
                  const cat = CATEGORIES.find((c) => c.id === t.category);
                  return (
                    <tr
                      key={t.id}
                      className="group transition-colors duration-100"
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        animationDelay: `${i * 20}ms`,
                      }}
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs" style={{ color: '#5a6a8a' }}>{fmtDate(t.date)}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-white">{t.description}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border"
                          style={{
                            background: `${cat?.color}18`,
                            borderColor: `${cat?.color}30`,
                            color: cat?.color,
                          }}
                        >
                          {cat?.emoji} {cat?.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                          {t.type === 'income' ? '↑' : '↓'} {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="font-mono font-bold"
                          style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}
                        >
                          {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal(t)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-blue-500/10"
                              style={{ color: '#3b82f6' }}
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/10"
                              style={{ color: '#f43f5e' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {transactions.map((t) => {
              const cat = CATEGORIES.find((c) => c.id === t.category);
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl p-3 border"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${cat?.color}15` }}
                  >
                    {cat?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{t.description}</p>
                    <p className="text-[11px]" style={{ color: '#4a5a7a' }}>
                      {cat?.label} · {fmtDate(t.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="font-mono text-sm font-bold"
                      style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}
                    >
                      {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                    </p>
                    {role === 'admin' && (
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <button onClick={() => openModal(t)} style={{ color: '#3b82f6' }}>
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} style={{ color: '#f43f5e' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}