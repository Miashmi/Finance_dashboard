import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Flame, Award, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, MONTHS, MONTH_KEYS } from '../data/mockData';

function buildMonthlyComparison(transactions) {
  return MONTH_KEYS.map((key, idx) => {
    const monthly = transactions.filter((t) => t.date.startsWith(key));
    const income  = monthly.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthly.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { month: MONTHS[idx].split(' ')[0], income, expense, savings: income - expense };
  });
}

function buildTopCategories(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total    = expenses.reduce((s, t) => s + t.amount, 0);
  const grouped  = {};

  expenses.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });

  return Object.entries(grouped)
    .map(([id, amount]) => {
      const cat = CATEGORIES.find((c) => c.id === id);
      return { id, name: cat?.label || id, color: cat?.color, emoji: cat?.emoji, amount, pct: total > 0 ? (amount / total) * 100 : 0 };
    })
    .sort((a, b) => b.amount - a.amount);
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl p-4 text-sm border shadow-xl" style={{ background: '#0d1526', borderColor: 'rgba(255,255,255,0.1)', minWidth: 170 }}>
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span style={{ color: '#7a8aaa' }} className="capitalize">{p.name}</span>
          </div>
          <span className="font-mono font-bold" style={{ color: p.fill }}>
            ₹{Number(p.value).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
};

function InsightCard({ icon: Icon, label, value, sub, color, bg, border }) {
  return (
    <div className="card card-hover" style={{ borderColor: border, boxShadow: `0 0 24px ${color}12` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, border: `1px solid ${border}` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs mb-0.5" style={{ color: '#5a6a8a' }}>{label}</p>
          <p className="font-bold text-white text-base leading-tight truncate">{value}</p>
          {sub && <p className="text-xs mt-1 leading-snug" style={{ color: '#3a4a6a' }}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useApp();

  const monthly    = buildMonthlyComparison(transactions);
  const topCats    = buildTopCategories(transactions);
  const income     = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense    = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;
  const topCat     = topCats[0];
  const avgMonthly = expense > 0 ? Math.round(expense / Math.max(MONTH_KEYS.length, 1)) : 0;

  // Best and worst saving month
  const sorted    = [...monthly].sort((a, b) => b.savings - a.savings);
  const bestMonth = sorted[0];
  const worstMonth = sorted[sorted.length - 1];

  // Last 2 months comparison
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const expenseDelta = lastMonth && prevMonth ? lastMonth.expense - prevMonth.expense : 0;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <InsightCard
          icon={Flame}
          label="Top Spending Category"
          value={topCat ? `${topCat.emoji} ${topCat.name}` : '—'}
          sub={topCat ? `₹${Number(topCat.amount).toLocaleString('en-IN')} · ${topCat.pct.toFixed(1)}% of expenses` : 'No expenses yet'}
          color="#f59e0b" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.2)"
        />
        <InsightCard
          icon={Target}
          label="Savings Rate"
          value={`${savingsRate}%`}
          sub={Number(savingsRate) >= 20 ? '✦ Great! Above 20% target' : '⚠ Below 20% savings target'}
          color={Number(savingsRate) >= 20 ? '#10b981' : '#f43f5e'}
          bg={Number(savingsRate) >= 20 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'}
          border={Number(savingsRate) >= 20 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}
        />
        <InsightCard
          icon={Award}
          label="Avg Monthly Expense"
          value={`₹${Number(avgMonthly).toLocaleString('en-IN')}`}
          sub={`Over ${MONTH_KEYS.length} months tracked`}
          color="#3b82f6" bg="rgba(59,130,246,0.1)" border="rgba(59,130,246,0.2)"
        />
        <InsightCard
          icon={TrendingUp}
          label="Best Savings Month"
          value={bestMonth ? `${bestMonth.month} — ₹${Number(bestMonth.savings).toLocaleString('en-IN')}` : '—'}
          sub="Highest net savings"
          color="#10b981" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.2)"
        />
        <InsightCard
          icon={TrendingDown}
          label="Highest Spend Month"
          value={worstMonth ? `${worstMonth.month} — ₹${Number(worstMonth.expense).toLocaleString('en-IN')}` : '—'}
          sub="Lowest net savings"
          color="#f43f5e" bg="rgba(244,63,94,0.1)" border="rgba(244,63,94,0.2)"
        />
        <InsightCard
          icon={AlertTriangle}
          label="Month-over-Month Spend"
          value={expenseDelta >= 0 ? `+₹${Number(expenseDelta).toLocaleString('en-IN')}` : `−₹${Number(Math.abs(expenseDelta)).toLocaleString('en-IN')}`}
          sub={`vs previous month — ${expenseDelta >= 0 ? 'spending increased' : 'spending decreased'}`}
          color={expenseDelta <= 0 ? '#10b981' : '#f59e0b'}
          bg={expenseDelta <= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}
          border={expenseDelta <= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}
        />
      </div>

      {/* Monthly comparison bar chart */}
      <div className="card">
        <div className="mb-6">
          <h2 className="font-bold text-white text-base">Monthly Comparison</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>Income vs expenses per month</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#4a5a7a', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4a5a7a', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="income"  name="Income"   fill="#10b981" radius={[6,6,0,0]} maxBarSize={40} />
            <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[6,6,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
      <div className="card">
        <div className="mb-5">
          <h2 className="font-bold text-white text-base">Category Deep Dive</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>All expense categories ranked by spend</p>
        </div>
        {topCats.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#4a5a7a' }}>No expense data</p>
        ) : (
          <div className="space-y-3">
            {topCats.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-4">
                <span className="text-xs font-mono w-5 shrink-0" style={{ color: '#3a4a6a' }}>
                  #{i + 1}
                </span>
                <span className="text-lg w-7 shrink-0">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{cat.name}</span>
                    <span className="font-mono text-sm font-bold ml-3 shrink-0" style={{ color: cat.color }}>
                      ₹{Number(cat.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono w-12 text-right shrink-0" style={{ color: '#5a6a8a' }}>
                  {cat.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}