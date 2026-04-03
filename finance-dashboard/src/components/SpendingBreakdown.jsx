import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

function buildCategoryData(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total    = expenses.reduce((s, t) => s + t.amount, 0);

  const grouped = {};
  expenses.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });

  return Object.entries(grouped)
    .map(([id, amount]) => {
      const cat = CATEGORIES.find((c) => c.id === id);
      return {
        id,
        name:    cat?.label || id,
        color:   cat?.color || '#94a3b8',
        emoji:   cat?.emoji || '📦',
        amount,
        pct:     total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm border shadow-2xl"
      style={{ background: '#0d1526', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <p className="font-semibold text-white mb-1">{d.emoji} {d.name}</p>
      <p className="font-mono" style={{ color: d.color }}>
        ₹{Number(d.amount).toLocaleString('en-IN')}
      </p>
      <p className="text-xs" style={{ color: '#7a8aaa' }}>{d.pct}% of expenses</p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { transactions } = useApp();
  const data = buildCategoryData(transactions);
  const top5 = data.slice(0, 5);

  if (data.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="font-semibold text-white">No expense data</p>
        <p className="text-xs mt-1" style={{ color: '#4a5a7a' }}>Add some transactions to see breakdown</p>
      </div>
    );
  }

  return (
    <div className="card stagger-6">
      <div className="mb-5">
        <h2 className="font-bold text-white text-base">Spending Breakdown</h2>
        <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>Expenses by category</p>
      </div>

      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              dataKey="amount"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3a4a6a' }}>Total</p>
          <p className="font-mono font-bold text-sm text-white">
            ₹{data.reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2.5 mt-4">
        {top5.map((d) => (
          <div key={d.id} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs flex-1 truncate" style={{ color: '#8a9ab8' }}>
              {d.emoji} {d.name}
            </span>
            <span className="text-xs font-mono font-semibold" style={{ color: d.color }}>
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}