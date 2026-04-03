import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryById } from '../data/mockData';

function fmt(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function RecentTransactions() {
  const { transactions, setPage } = useApp();

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="card stagger-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-white text-base">Recent Transactions</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>Latest activity</p>
        </div>
        <button
          onClick={() => setPage('transactions')}
          className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
          style={{ color: '#10b981' }}
        >
          View all <ArrowUpRight size={13} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📂</p>
          <p className="text-sm" style={{ color: '#4a5a7a' }}>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {recent.map((t) => {
            const cat = getCategoryById(t.category);
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{
                    background: t.type === 'income'
                      ? 'rgba(16,185,129,0.1)'
                      : 'rgba(244,63,94,0.1)',
                  }}
                >
                  {cat.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.description}</p>
                  <p className="text-[11px]" style={{ color: '#4a5a7a' }}>
                    {cat.label} · {fmtDate(t.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: t.type === 'income' ? '#10b981' : '#f43f5e' }}
                  >
                    {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}