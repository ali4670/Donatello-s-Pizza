import { useState } from 'react';
import { Tag, Plus, Pencil, Trash2, X, Percent, DollarSign } from 'lucide-react';
import { useAdmin, type AdminCoupon } from '@/context/AdminContext';

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrder: '',
    maxUses: '',
    active: true,
    expiresAt: '',
  });

  const resetForm = () => {
    setForm({ code: '', discountType: 'percentage', discountValue: '', minOrder: '', maxUses: '', active: true, expiresAt: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue.toString(),
      minOrder: c.minOrder.toString(),
      maxUses: c.maxUses !== null ? c.maxUses.toString() : '',
      active: c.active,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 16) : '',
    });
    setEditing(c);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code.trim() || !form.discountValue) return;
    const data = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrder: form.minOrder ? parseFloat(form.minOrder) : 0,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      active: form.active,
      expiresAt: form.expiresAt || null,
    };
    if (editing) {
      updateCoupon(editing.id, data);
    } else {
      addCoupon(data);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteCoupon(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-podium text-white text-2xl sm:text-3xl uppercase tracking-tight">Coupons</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{coupons.length} coupons</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-amethyst-dark border border-amethyst-royal/20 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-inter font-semibold">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={resetForm} className="text-amethyst-mauve/50 hover:text-amethyst-mauve"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40"
                />
              </div>
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">Discount Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, discountType: 'percentage' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-inter border transition-all ${
                      form.discountType === 'percentage'
                        ? 'bg-amethyst-royal/25 border-amethyst-lavender/50 text-white'
                        : 'border-amethyst-royal/15 text-amethyst-mauve/50 hover:border-amethyst-royal/40'
                    }`}
                  >
                    <Percent className="w-4 h-4" />Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, discountType: 'fixed' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-inter border transition-all ${
                      form.discountType === 'fixed'
                        ? 'bg-amethyst-royal/25 border-amethyst-lavender/50 text-white'
                        : 'border-amethyst-royal/15 text-amethyst-mauve/50 hover:border-amethyst-royal/40'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />Fixed Amount
                  </button>
                </div>
              </div>
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">
                  Discount Value * {form.discountType === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 5.00'}
                  min="0"
                  step="0.01"
                  className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40"
                />
              </div>
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">Minimum Order ($)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  placeholder="0 = no minimum"
                  min="0"
                  step="0.01"
                  className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40"
                />
              </div>
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">Max Uses</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  min="0"
                  className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40"
                />
              </div>
              <div>
                <label className="text-amethyst-mauve/60 font-inter text-xs mb-1.5 block">Expires At</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white font-inter focus:outline-none focus:border-amethyst-lavender/40"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-green-600' : 'bg-amethyst-dark-2/80 border border-amethyst-royal/20'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.active ? 'translate-x-4.5 left-0' : 'left-0.5'}`} />
                </button>
                <span className="text-white font-inter text-sm">Active</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetForm} className="flex-1 px-4 py-2.5 border border-amethyst-royal/20 text-amethyst-mauve/60 font-inter text-xs rounded-xl hover:border-amethyst-royal/50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!form.code.trim() || !form.discountValue} className="flex-1 px-4 py-2.5 bg-amethyst-royal hover:bg-amethyst-velvet disabled:opacity-50 text-white font-inter text-xs rounded-xl transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Tag className="w-12 h-12 text-amethyst-royal/30 mb-4" />
          <p className="text-amethyst-mauve/50 font-inter text-sm">No coupons yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 hover:border-amethyst-royal/25 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amethyst-royal/20 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5 text-amethyst-lavender" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-white font-bold text-lg tracking-wider">{coupon.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-inter ${coupon.active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-amethyst-lavender font-inter text-sm font-bold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}`} OFF
                    </span>
                    {coupon.minOrder > 0 && (
                      <span className="text-amethyst-mauve/40 font-inter text-xs">Min order ${coupon.minOrder.toFixed(2)}</span>
                    )}
                    <span className="text-amethyst-mauve/40 font-inter text-xs">
                      Used: {coupon.usedCount}{coupon.maxUses !== null ? ` / ${coupon.maxUses}` : ''}
                    </span>
                    {coupon.expiresAt && (
                      <span className="text-amethyst-mauve/40 font-inter text-xs">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(coupon)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-lavender transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(coupon.id)} className="p-2 text-amethyst-mauve/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-amethyst-dark border border-amethyst-royal/20 rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-white font-inter font-semibold mb-2">Delete Coupon?</h3>
            <p className="text-amethyst-mauve/50 font-inter text-sm mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-amethyst-royal/20 text-amethyst-mauve/60 font-inter text-xs rounded-xl hover:border-amethyst-royal/50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-inter text-xs rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
