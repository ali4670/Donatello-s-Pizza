import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAdmin, type AdminSize } from '@/context/AdminContext';

export default function AdminSizes() {
  const { sizes, addSize, updateSize, deleteSize } = useAdmin();
  const [editing, setEditing] = useState<AdminSize | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', desc: '', priceMod: '', icon: '🍕' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setForm({ label: '', desc: '', priceMod: '', icon: '🍕' }); setEditing(null); setShowForm(false); };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (s: AdminSize) => {
    setForm({ label: s.label, desc: s.desc, priceMod: s.priceMod.toString(), icon: s.icon });
    setEditing(s);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.label.trim()) return;
    const data = { label: form.label.trim(), desc: form.desc.trim(), priceMod: parseFloat(form.priceMod) || 0, icon: form.icon };
    if (editing) updateSize(editing.id, data);
    else addSize(data);
    resetForm();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Sizes</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{sizes.length} sizes configured</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all">
          <Plus className="w-4 h-4" />Add Size
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-md bg-amethyst-dark/95 backdrop-blur-xl border border-amethyst-royal/20 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amethyst-royal/10">
              <h2 className="text-white font-inter font-semibold">{editing ? 'Edit Size' : 'Add Size'}</h2>
              <button onClick={resetForm} className="text-amethyst-mauve/60 hover:text-amethyst-mauve"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Label *</label>
                  <input value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Large" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                </div>
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Description</label>
                  <input value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} placeholder='e.g. 14"' className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Price Modifier</label>
                  <input type="number" step="0.01" value={form.priceMod} onChange={(e) => setForm((p) => ({ ...p, priceMod: e.target.value }))} placeholder="0 for base price" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                  <p className="text-amethyst-mauve/30 font-inter text-[10px] mt-1">Negative = discount, Positive = upcharge</p>
                </div>
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Icon</label>
                  <input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 text-center text-2xl" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={resetForm} className="flex-1 py-3 border border-amethyst-royal/20 text-amethyst-mauve/60 text-xs tracking-widest uppercase font-inter rounded-xl hover:border-amethyst-royal/40 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-amethyst-royal hover:bg-amethyst-velvet text-white text-xs tracking-widest uppercase font-inter rounded-xl transition-all">{editing ? 'Update' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sizes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sizes.map((s) => (
          <div key={s.id} className="flex items-center gap-4 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 hover:border-amethyst-royal/25 transition-colors">
            <span className="text-3xl">{s.icon}</span>
            <div className="flex-1">
              <h3 className="text-white font-inter font-semibold text-sm">{s.label}</h3>
              <p className="text-amethyst-mauve/40 font-inter text-xs">{s.desc}</p>
              <span className={`text-xs font-inter font-bold ${s.priceMod === 0 ? 'text-green-400' : s.priceMod > 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                {s.priceMod === 0 ? 'Base price' : s.priceMod > 0 ? `+$${s.priceMod.toFixed(2)}` : `-$${Math.abs(s.priceMod).toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(s)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-lavender transition-colors"><Pencil className="w-4 h-4" /></button>
              {deleteConfirm === s.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => { deleteSize(s.id); setDeleteConfirm(null); }} className="p-2 text-red-400"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirm(null)} className="p-2 text-amethyst-mauve/40"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(s.id)} className="p-2 text-amethyst-mauve/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
