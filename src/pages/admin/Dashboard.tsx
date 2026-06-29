import { Link } from 'react-router-dom';
import { Pizza, Ruler, Plus, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminDashboard() {
  const { products, sizes, addons, addonCategories } = useAdmin();

  const cards = [
    { icon: Pizza, label: 'Products', count: products.length, to: '/admin/products', color: 'from-amethyst-royal to-amethyst-velvet' },
    { icon: Ruler, label: 'Sizes', count: sizes.length, to: '/admin/sizes', color: 'from-green-600 to-green-700' },
    { icon: Plus, label: 'Add-ons', count: addons.length, to: '/admin/addons', color: 'from-amber-600 to-amber-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-podium text-white text-2xl sm:text-3xl uppercase tracking-tight">Dashboard</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">Manage your restaurant menu</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 hover:border-amethyst-royal/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-amethyst-mauve/30 group-hover:text-amethyst-lavender transition-colors" />
            </div>
            <p className="text-white font-inter text-2xl font-bold">{card.count}</p>
            <p className="text-amethyst-mauve/50 font-inter text-xs uppercase tracking-wider mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-amethyst-royal/10 flex items-center justify-between">
          <h2 className="text-white font-inter font-semibold text-sm">Recent Products</h2>
          <Link to="/admin/products" className="text-amethyst-lavender text-xs font-inter hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-amethyst-royal/10">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-inter text-sm font-medium truncate">{p.name}</p>
                <p className="text-amethyst-mauve/40 font-inter text-xs">{p.category}</p>
              </div>
              <span className="text-amethyst-lavender font-inter text-sm font-bold">${p.price.toFixed(2)}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.available ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                {p.available ? 'Active' : 'Hidden'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Addon Categories */}
      <div className="mt-6 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5">
        <h2 className="text-white font-inter font-semibold text-sm mb-3">Add-on Categories</h2>
        <div className="flex flex-wrap gap-2">
          {addonCategories.map((cat) => (
            <span key={cat.id} className="text-xs font-inter text-amethyst-lavender/70 border border-amethyst-royal/20 rounded-full px-3 py-1">
              {cat.name} ({addons.filter((a) => a.category === cat.id).length})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
