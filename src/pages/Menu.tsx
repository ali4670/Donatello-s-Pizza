import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';

export default function MenuPage() {
  const { items } = useCart();
  const { t } = useLang();
  const { products } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');

  const availableProducts = products.filter((p) => p.available);

  const categorySet = [...new Set(availableProducts.map((p) => p.category))];
  const categories = [
    { key: 'All', label: t.all },
    ...categorySet.map((c) => ({ key: c, label: c })),
  ];

  const filtered = activeCategory === 'All'
    ? availableProducts
    : availableProducts.filter((p) => p.category === activeCategory);

  const getQuantity = (id: string) =>
    items.filter((i) => i.id.startsWith(id)).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16">
      {/* Hero Image */}
      <div className="max-w-6xl mx-auto mb-12 rounded-bubble-xl overflow-hidden border border-amethyst-royal/15">
        <img src="/menu.png" alt="Our Menu" className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover" />
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.handcraftedPies}</span>
        <h1 className="font-podium text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight mt-3">{t.menu}</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-4 max-w-lg mx-auto">{t.menuDesc}</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300 ${
              activeCategory === cat.key
                ? 'bg-amethyst-royal text-white'
                : 'border border-amethyst-royal/30 text-amethyst-mauve/60 hover:border-amethyst-royal/60 hover:text-amethyst-mauve'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Pizza Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
        {filtered.map((pizza) => (
          <Link
            key={pizza.id}
            to={`/menu/${pizza.id}`}
            className="group text-left bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg overflow-hidden hover:border-amethyst-royal/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] bg-amethyst-ink/30 overflow-hidden">
              <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-amethyst-dark/40 to-transparent" />
              {pizza.badge && <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-amethyst-royal text-white text-[8px] sm:text-[10px] tracking-widest uppercase font-inter px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">{pizza.badge}</span>}
              {getQuantity(pizza.id) > 0 && (
                <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-amethyst-mauve text-amethyst-dark text-[9px] sm:text-[11px] font-bold font-inter w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">{getQuantity(pizza.id)}</span>
              )}
            </div>
            <div className="p-3 sm:p-5">
              <div className="flex items-start justify-between gap-1 sm:gap-2">
                <div className="min-w-0">
                  <span className="text-amethyst-lavender/60 text-[8px] sm:text-[10px] font-inter tracking-widest uppercase">{pizza.category}</span>
                  <h3 className="font-podium text-white text-sm sm:text-lg uppercase tracking-tight mt-0.5 truncate">{pizza.name}</h3>
                </div>
                <span className="text-amethyst-lavender font-inter text-sm sm:text-lg font-bold shrink-0">${pizza.price.toFixed(2)}</span>
              </div>
              <p className="text-amethyst-mauve/50 text-xs sm:text-sm font-inter mt-1 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">{pizza.desc}</p>
              <div className="mt-2 sm:mt-4 w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 text-[10px] sm:text-xs tracking-widest uppercase font-inter rounded-bubble bg-amethyst-royal/20 text-amethyst-lavender group-hover:bg-amethyst-royal group-hover:text-white transition-all duration-300">
                {t.customizeAndAdd}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-amethyst-mauve/40 font-inter text-sm">No products available in this category.</p>
        </div>
      )}
    </div>
  );
}
