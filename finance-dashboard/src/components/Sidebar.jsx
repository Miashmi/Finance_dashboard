import { LayoutDashboard, ArrowLeftRight, Lightbulb, ShieldCheck, Eye, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activePage, setPage, role, setRole } = useApp();

  const handleNav = (id) => {
    setPage(id);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 flex flex-col
          border-r transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0a0e1a 0%, #080c17 100%)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
          >
            F
          </div>
          <div>
            <p className="font-bold text-white tracking-wide">FinLens</p>
            <p className="text-[10px] font-mono" style={{ color: '#4ade80' }}>Financial Insights</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-4 mb-3" style={{ color: '#3a4a6a' }}>
            Menu
          </p>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {activePage === id && (
                <ChevronRight size={14} className="ml-auto" style={{ color: '#10b981' }} />
              )}
            </button>
          ))}
        </nav>

        {/* Role switcher */}
        <div
          className="mx-4 mb-4 rounded-2xl p-4 border"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#3a4a6a' }}>
            Active Role
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'border text-gray-500 hover:text-gray-300'
              }`}
              style={{ borderColor: role === 'admin' ? undefined : 'rgba(255,255,255,0.08)' }}
            >
              <ShieldCheck size={12} />
              Admin
            </button>
            <button
              onClick={() => setRole('viewer')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                role === 'viewer'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'border text-gray-500 hover:text-gray-300'
              }`}
              style={{ borderColor: role === 'viewer' ? undefined : 'rgba(255,255,255,0.08)' }}
            >
              <Eye size={12} />
              Viewer
            </button>
          </div>
          <p className="text-[10px] mt-2.5 leading-relaxed" style={{ color: '#3a4a6a' }}>
            {role === 'admin'
              ? '✦ Full access — add, edit & delete transactions'
              : '✦ Read-only — viewing data only'}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] text-center" style={{ color: '#2a3a55' }}>
            FinLens v1.0 · Built with React
          </p>
        </div>
      </aside>
    </>
  );
}