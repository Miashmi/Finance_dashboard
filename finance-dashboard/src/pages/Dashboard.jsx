import SummaryCards from '../components/SummaryCards';
import BalanceTrend from '../components/BalanceTrend';
import SpendingBreakdown from '../components/SpendingBreakdown';
import RecentTransactions from '../components/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Summary KPI cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BalanceTrend />
        </div>
        <div>
          <SpendingBreakdown />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  );
}