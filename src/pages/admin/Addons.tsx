import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import { useAdmin, type AdminAddon } from '@/context/AdminContext';

export default function AdminAddons() {
  const { addons, addonCategories, addAddon, updateAddon, deleteAddon, addAddonCategory, deleteAddonCategory, uploadImage } = useAdmin();
  const [editing, setEditing] = useState<AdminAddon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [form, setForm] = useState({ name: '', price: '', emoji: '🧀', category: '', image: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [uploading, setUploading] = useState(false);

  const resetForm = () => { setForm({ name: '', price: '', emoji: '🧀', category: addonCategories[0]?.id || '', image: '' }); setEditing(null); setShowForm(false); };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (a: AdminAddon) => {
    setForm({ name: a.name, price: a.price.toString(), emoji: a.emoji, category: a.category, image: a.image || '' });
    setEditing(a);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = { name: form.name.trim(), price: parseFloat(form.price) || 0, emoji: form.emoji, category: form.category, image: form.image || undefined };
    if (editing) updateAddon(editing.id, data);
    else addAddon(data);
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addAddonCategory(newCatName.trim());
    setNewCatName('');
    setShowCatForm(false);
  };

  const filtered = activeCategory === 'all' ? addons : addons.filter((a) => a.category === activeCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Add-ons</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{addons.length} add-ons in {addonCategories.length} categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatForm(true)} className="flex items-center gap-2 border border-amethyst-royal/30 text-amethyst-mauve/70 hover:text-amethyst-mauve px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all">
            <Tag className="w-4 h-4" />Category
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all">
            <Plus className="w-4 h-4" />Add Add-on
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-1.5 text-xs tracking-wider uppercase font-inter rounded-full transition-all ${activeCategory === 'all' ? 'bg-amethyst-royal text-white' : 'border border-amethyst-royal/20 text-amethyst-mauve/50 hover:border-amethyst-royal/40'}`}>All</button>
        {addonCategories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1">
            <button onClick={() => setActiveCategory(cat.id)} className={`px-4 py-1.5 text-xs tracking-wider uppercase font-inter rounded-full transition-all ${activeCategory === cat.id ? 'bg-amethyst-royal text-white' : 'border border-amethyst-royal/20 text-amethyst-mauve/50 hover:border-amethyst-royal/40'}`}>{cat.name}</button>
            {deleteCatConfirm === cat.id ? (
              <div className="flex items-center gap-0.5">
                <button onClick={() => { deleteAddonCategory(cat.id); setDeleteCatConfirm(null); setActiveCategory('all'); }} className="text-red-400"><Check className="w-3 h-3" /></button>
                <button onClick={() => setDeleteCatConfirm(null)} className="text-amethyst-mauve/40"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <button onClick={() => setDeleteCatConfirm(cat.id)} className="text-amethyst-mauve/30 hover:text-red-400"><X className="w-3 h-3" /></button>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Form */}
      {showCatForm && (
        <div className="mb-6 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 flex items-center gap-3">
          <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Category name" className="flex-1 bg-amethyst-dark/60 border border-amethyst-royal/15 rounded-lg px-3 py-2 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} />
          <button onClick={handleAddCategory} className="bg-amethyst-royal text-white px-4 py-2 text-xs font-inter rounded-lg">Add</button>
          <button onClick={() => { setShowCatForm(false); setNewCatName(''); }} className="text-amethyst-mauve/40 hover:text-amethyst-mauve"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-md bg-amethyst-dark/95 backdrop-blur-xl border border-amethyst-royal/20 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amethyst-royal/10">
              <h2 className="text-white font-inter font-semibold">{editing ? 'Edit Add-on' : 'Add Add-on'}</h2>
              <button onClick={resetForm} className="text-amethyst-mauve/60 hover:text-amethyst-mauve"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Image */}
              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Photo</label>
                <div className="flex items-center gap-4">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-amethyst-royal/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-amethyst-dark-2/60 border border-amethyst-royal/20 flex items-center justify-center text-2xl">{form.emoji}</div>
                  )}
                  <label className={`cursor-pointer bg-amethyst-dark-2/60 border border-amethyst-royal/20 rounded-xl px-4 py-2 text-xs font-inter text-amethyst-mauve/60 hover:text-amethyst-mauve hover:border-amethyst-royal/40 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Name *</label>
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Extra Cheese" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                </div>
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Emoji</label>
                  <input value={form.emoji} onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white font-inter focus:outline-none focus:border-amethyst-lavender/40 text-center text-2xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Price *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                </div>
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white font-inter focus:outline-none focus:border-amethyst-lavender/40">
                    {addonCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
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

      {/* Addons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((a) => (
          <div key={a.id} className="flex items-center gap-3 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 hover:border-amethyst-royal/25 transition-colors">
            {a.image ? (
              <img src={a.image} alt={a.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
            ) : (
              <span className="text-2xl shrink-0">{a.emoji}</span>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-inter font-semibold text-sm truncate">{a.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-amethyst-lavender font-inter text-xs font-bold">${a.price.toFixed(2)}</span>
                <span className="text-amethyst-mauve/30 font-inter text-[10px] uppercase">{addonCategories.find((c) => c.id === a.category)?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(a)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-lavender transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              {deleteConfirm === a.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => { deleteAddon(a.id); setDeleteConfirm(null); }} className="p-2 text-red-400"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteConfirm(null)} className="p-2 text-amethyst-mauve/40"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(a.id)} className="p-2 text-amethyst-mauve/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
