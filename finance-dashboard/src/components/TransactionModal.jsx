import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const today = new Date().toISOString().split('T')[0];

const EMPTY = {
  description: '',
  amount: '',
  date: today,
  type: 'expense',
  category: 'food',
};

export default function TransactionModal() {
  const { modalOpen, editingTransaction, closeModal, addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEdit = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount:      String(editingTransaction.amount),
        date:        editingTransaction.date,
        type:        editingTransaction.type,
        category:    editingTransaction.category,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editingTransaction, modalOpen]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 300)); // brief UI feedback

    const payload = {
      ...form,
      amount: Number(form.amount),
      ...(isEdit ? { id: editingTransaction.id } : {}),
    };

    if (isEdit) updateTransaction(payload);
    else        addTransaction(payload);

    setSaving(false);
  };

  if (!modalOpen) return null;

  const income_cats  = CATEGORIES.filter((c) => ['salary','freelance','investment'].includes(c.id));
  const expense_cats = CATEGORIES.filter((c) => !['salary','freelance','investment'].includes(c.id));
  const catList      = form.type === 'income' ? income_cats : expense_cats;

  // Auto-correct category when type changes
  const handleTypeChange = (type) => {
    const cats = type === 'income'
      ? ['salary','freelance','investment']
      : CATEGORIES.filter((c) => !['salary','freelance','investment'].includes(c.id)).map((c) => c.id);

    setForm((f) => ({
      ...f,
      type,
      category: cats.includes(f.category) ? f.category : cats[0],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl animate-slide-up overflow-hidden"
        style={{ background: '#0d1526', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="font-bold text-white text-base">
              {isEdit ? '✏️ Edit Transaction' : '➕ New Transaction'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>
              {isEdit ? 'Modify the transaction details below' : 'Fill in the transaction details'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#7a8aaa' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="field-label">Type</label>
            <div className="flex gap-2 mt-1.5">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 capitalize ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/35'
                      : 'border-white/8 text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ borderColor: form.type === t ? undefined : 'rgba(255,255,255,0.08)' }}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Description</label>
            <input
              type="text"
              placeholder="e.g., Monthly Salary, Grocery Shopping…"
              value={form.description}
              onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((e2) => ({ ...e2, description: '' })); }}
              className={`input mt-1.5 ${errors.description ? 'border-rose-500/50' : ''}`}
            />
            {errors.description && <p className="text-xs mt-1 text-rose-400">{errors.description}</p>}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Amount (₹)</label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => { setForm((f) => ({ ...f, amount: e.target.value })); setErrors((e2) => ({ ...e2, amount: '' })); }}
                className={`input mt-1.5 ${errors.amount ? 'border-rose-500/50' : ''}`}
              />
              {errors.amount && <p className="text-xs mt-1 text-rose-400">{errors.amount}</p>}
            </div>
            <div>
              <label className="field-label">Date</label>
              <input
                type="date"
                value={form.date}
                max={today}
                onChange={(e) => { setForm((f) => ({ ...f, date: e.target.value })); setErrors((e2) => ({ ...e2, date: '' })); }}
                className={`input mt-1.5 ${errors.date ? 'border-rose-500/50' : ''}`}
                style={{ colorScheme: 'dark' }}
              />
              {errors.date && <p className="text-xs mt-1 text-rose-400">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="field-label">Category</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {catList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                  className={`rounded-xl py-2 px-2 text-xs font-medium border transition-all duration-150 text-center ${
                    form.category === cat.id
                      ? 'border-opacity-40'
                      : 'border-white/6 text-gray-500 hover:text-gray-300 hover:border-white/10'
                  }`}
                  style={
                    form.category === cat.id
                      ? {
                          background: `${cat.color}18`,
                          borderColor: `${cat.color}40`,
                          color: cat.color,
                        }
                      : { borderColor: 'rgba(255,255,255,0.06)' }
                  }
                >
                  {cat.emoji} {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 pb-6 pt-2"
        >
          <button onClick={closeModal} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex-1 justify-center"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </span>
            ) : (
              <>
                <Check size={15} />
                {isEdit ? 'Update' : 'Add Transaction'}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #3a4a6a;
        }
      `}</style>
    </div>
  );
}