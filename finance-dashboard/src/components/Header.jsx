import { Menu, Download, Plus, ShieldCheck, Eye, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard',    sub: 'Your financial overview at a glance' },
  transactions: { title: 'Transactions', sub: 'All your income & expense records' },
  insights:     { title: 'Insights',     sub: 'Understand your spending patterns' },
};

export default function Header({ onMenuClick }) {
  const { activePage, role, openModal, exportCSV } = useApp();
  const { title, sub } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 py-4 border-b glass"
      style={{
        background: 'rgba(5,8,16,0.85)',
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: '#7a8aaa' }}
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
          <p className="text-xs hidden sm:block truncate" style={{ color: '#4a5a7a' }}>{sub}</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Role badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border ${
            role === 'admin'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}
        >
          {role === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </div>

        {/* Export */}
        <button onClick={exportCSV} className="btn-secondary" title="Export CSV">
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Add transaction (admin only) */}
        {role === 'admin' && (
          <button onClick={() => openModal()} className="btn-primary">
            <Plus size={15} />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}