import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TransactionModal from './components/TransactionModal';
import DashboardPage from './pages/Dashboard';
import TransactionList from './components/TransactionList';
import InsightsPage from './components/InsightsPage';

function AppShell() {
  const { activePage, modalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5">
          {activePage === 'dashboard'    && <DashboardPage />}
          {activePage === 'transactions' && <TransactionList />}
          {activePage === 'insights'     && <InsightsPage />}
        </main>
      </div>
      {modalOpen && <TransactionModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}