import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import { useAdmin, type AdminProduct } from '@/context/AdminContext';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct, uploadImage } = useAdmin();
  const categoryNames = categories.map((c) => c.name);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', desc: '', price: '', category: categoryNames[0] || 'Signature', image: '/Pizza.jpeg', badge: '', available: true });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', desc: '', price: '', category: categoryNames[0] || 'Signature', image: '/Pizza.jpeg', badge: '', available: true });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (p: AdminProduct) => {
    setForm({ name: p.name, desc: p.desc, price: p.price.toString(), category: p.category, image: p.image, badge: p.badge || '', available: p.available });
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    const data = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      price: parseFloat(form.price),
      category: form.category,
      image: form.image,
      badge: form.badge.trim() || undefined,
      available: form.available,
    };
    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct(data);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Products</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{products.length} items</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all">
          <Plus className="w-4 h-4" />Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-lg bg-amethyst-dark/95 backdrop-blur-xl border border-amethyst-royal/20 rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amethyst-royal/10">
              <h2 className="text-white font-inter font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={resetForm} className="text-amethyst-mauve/60 hover:text-amethyst-mauve"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Image */}
              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Photo</label>
                <div className="flex items-center gap-4">
                  <img src={form.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-amethyst-royal/20" />
                  <label className={`cursor-pointer bg-amethyst-dark-2/60 border border-amethyst-royal/20 rounded-xl px-4 py-2 text-xs font-inter text-amethyst-mauve/60 hover:text-amethyst-mauve hover:border-amethyst-royal/40 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
              </div>

              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} placeholder="Description" rows={2} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Price *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
                </div>
                <div>
                  <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white font-inter focus:outline-none focus:border-amethyst-lavender/40">
                    {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter uppercase tracking-wider mb-1.5 block">Badge (optional)</label>
                <input value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} placeholder="e.g. Best Seller, Spicy, New" className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors ${form.available ? 'bg-amethyst-royal' : 'bg-amethyst-dark-2'} relative`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.available ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-white font-inter text-sm">{form.available ? 'Visible on menu' : 'Hidden from menu'}</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={resetForm} className="flex-1 py-3 border border-amethyst-royal/20 text-amethyst-mauve/60 text-xs tracking-widest uppercase font-inter rounded-xl hover:border-amethyst-royal/40 transition-all">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-amethyst-royal hover:bg-amethyst-velvet text-white text-xs tracking-widest uppercase font-inter rounded-xl transition-all">{editing ? 'Update' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 hover:border-amethyst-royal/25 transition-colors">
            <div className="flex items-start gap-3 sm:gap-4">
              <img src={p.image} alt={p.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-inter font-semibold text-sm truncate">{p.name}</h3>
                      {p.badge && <span className="text-[10px] bg-amethyst-royal/20 text-amethyst-lavender px-2 py-0.5 rounded-full">{p.badge}</span>}
                    </div>
                    <p className="text-amethyst-mauve/40 font-inter text-xs mt-0.5 line-clamp-1 sm:line-clamp-none">{p.desc}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${p.available ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>{p.available ? 'Active' : 'Hidden'}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-amethyst-lavender font-inter text-sm font-bold">${p.price.toFixed(2)}</span>
                    <span className="text-amethyst-mauve/30 font-inter text-[10px] uppercase">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateProduct(p.id, { available: !p.available })} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-mauve transition-colors" title={p.available ? 'Hide' : 'Show'}>
                      {p.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-lavender transition-colors"><Pencil className="w-4 h-4" /></button>
                    {deleteConfirm === p.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-mauve"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 text-amethyst-mauve/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
