import { useEffect, useRef, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AnimatedNumber({ value, prefix = '₹', duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplay(Math.round(eased * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return (
    <span className="number">
      {prefix}{display.toLocaleString('en-IN')}
    </span>
  );
}

const CARDS = [
  {
    key:    'balance',
    label:  'Net Balance',
    icon:   Wallet,
    color:  '#10b981',
    bg:     'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    glow:   '0 0 32px rgba(16,185,129,0.12)',
    getVal: ({ balance }) => balance,
    sub:    'Total accumulated',
  },
  {
    key:    'income',
    label:  'Total Income',
    icon:   TrendingUp,
    color:  '#34d399',
    bg:     'rgba(52,211,153,0.07)',
    border: 'rgba(52,211,153,0.15)',
    glow:   '0 0 32px rgba(52,211,153,0.08)',
    getVal: ({ income }) => income,
    sub:    'All sources',
  },
  {
    key:    'expense',
    label:  'Total Expenses',
    icon:   TrendingDown,
    color:  '#f43f5e',
    bg:     'rgba(244,63,94,0.07)',
    border: 'rgba(244,63,94,0.15)',
    glow:   '0 0 32px rgba(244,63,94,0.08)',
    getVal: ({ expense }) => expense,
    sub:    'All categories',
  },
  {
    key:    'savings',
    label:  'Savings Rate',
    icon:   ArrowUpRight,
    color:  '#f59e0b',
    bg:     'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.15)',
    glow:   '0 0 32px rgba(245,158,11,0.08)',
    getVal: ({ income, expense }) => income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    prefix: '',
    suffix: '%',
    sub:    'Of total income',
  },
];

export default function SummaryCards() {
  const { getSummary } = useApp();
  const summary = getSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map((card, i) => {
        const Icon  = card.icon;
        const value = card.getVal(summary);
        const prefix = card.prefix !== undefined ? card.prefix : '₹';
        const suffix = card.suffix || '';

        return (
          <div
            key={card.key}
            className={`card card-hover stagger-${i + 1}`}
            style={{ boxShadow: card.glow }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.bg, border: `1px solid ${card.border}` }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                style={{
                  color: card.color,
                  background: card.bg,
                  borderColor: card.border,
                }}
              >
                Live
              </div>
            </div>

            <p className="text-sm mb-1" style={{ color: '#5a6a8a' }}>{card.label}</p>
            <p className="text-2xl font-bold tracking-tight" style={{ color: card.color }}>
              {prefix}
              <AnimatedNumber value={value} prefix="" duration={700 + i * 80} />
              {suffix}
            </p>
            <p className="text-[11px] mt-1.5" style={{ color: '#3a4a6a' }}>{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}