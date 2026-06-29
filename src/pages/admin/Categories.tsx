import { useState } from 'react';
import { Plus, Trash2, X, Check, Tag } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminCategories() {
  const { categories, products, addCategory, deleteCategory } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory(newName.trim());
    setNewName('');
    setShowForm(false);
  };

  const getProductCount = (catName: string) =>
    products.filter((p) => p.category === catName).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Categories</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{categories.length} product categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-4 py-2.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 flex items-center gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 bg-amethyst-dark/60 border border-amethyst-royal/15 rounded-lg px-3 py-2 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button onClick={handleAdd} className="bg-amethyst-royal text-white px-4 py-2 text-xs font-inter rounded-lg">Add</button>
          <button onClick={() => { setShowForm(false); setNewName(''); }} className="text-amethyst-mauve/40 hover:text-amethyst-mauve">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-xl p-4 hover:border-amethyst-royal/25 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amethyst-royal/20 flex items-center justify-center">
                <Tag className="w-4 h-4 text-amethyst-lavender" />
              </div>
              <div>
                <h3 className="text-white font-inter font-semibold text-sm">{cat.name}</h3>
                <p className="text-amethyst-mauve/40 font-inter text-xs">{getProductCount(cat.name)} products</p>
              </div>
            </div>
            {deleteConfirm === cat.id ? (
              <div className="flex items-center gap-1">
                <button onClick={() => { deleteCategory(cat.id); setDeleteConfirm(null); }} className="p-2 text-red-400 hover:text-red-300"><Check className="w-4 h-4" /></button>
                <button onClick={() => setDeleteConfirm(null)} className="p-2 text-amethyst-mauve/40 hover:text-amethyst-mauve"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirm(cat.id)} className="p-2 text-amethyst-mauve/40 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <Tag className="w-12 h-12 text-amethyst-royal/30 mx-auto mb-4" />
          <p className="text-amethyst-mauve/50 font-inter text-sm">No categories yet</p>
          <p className="text-amethyst-mauve/30 font-inter text-xs mt-1">Add a category to organize your products</p>
        </div>
      )}
    </div>
  );
}
