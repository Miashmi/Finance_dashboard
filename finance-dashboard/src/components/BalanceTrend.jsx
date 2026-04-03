import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MONTHS, MONTH_KEYS } from '../data/mockData';

function buildChartData(transactions) {
  return MONTH_KEYS.map((key, idx) => {
    const monthly = transactions.filter((t) => t.date.startsWith(key));
    const income  = monthly.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthly.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { month: MONTHS[idx], income, expense, net: income - expense };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (v) => `₹${Number(v).toLocaleString('en-IN')}`;
  return (
    <div
      className="rounded-2xl p-4 text-sm shadow-2xl border"
      style={{
        background: '#0d1526',
        borderColor: 'rgba(255,255,255,0.1)',
        minWidth: 180,
      }}
    >
      <p className="font-semibold text-white mb-3">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: '#7a8aaa' }} className="capitalize">{p.name}</span>
          </div>
          <span className="font-mono font-bold" style={{ color: p.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { transactions } = useApp();
  const data = buildChartData(transactions);

  return (
    <div className="card stagger-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-white text-base">Balance Trend</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>6-month income vs expense overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded inline-block bg-emerald-400" />
            <span style={{ color: '#7a8aaa' }}>Income</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded inline-block bg-rose-400" />
            <span style={{ color: '#7a8aaa' }}>Expenses</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#4a5a7a', fontSize: 11, fontFamily: 'Outfit' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4a5a7a', fontSize: 10, fontFamily: 'Space Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
          <Area
            type="monotone" dataKey="income" name="Income"
            stroke="#10b981" strokeWidth={2.5}
            fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981' }}
          />
          <Area
            type="monotone" dataKey="expense" name="Expenses"
            stroke="#f43f5e" strokeWidth={2.5}
            fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: '#f43f5e' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}