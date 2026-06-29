import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Check, Sparkles, MessageSquare, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { useCart, type CartAddon } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { t } = useLang();
  const { products, sizes, addons } = useAdmin();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(sizes[1]?.label || 'Medium');
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="py-20 px-6 text-center">
        <h1 className="font-podium text-white text-2xl uppercase tracking-tight mb-4">Product Not Found</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mb-8">This item doesn&apos;t exist or has been removed.</p>
        <Link to="/menu" className="inline-flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-6 py-3 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all">
          <ArrowLeft className="w-4 h-4" />{t.backToMenu}
        </Link>
      </div>
    );
  }

  const sizeObj = sizes.find((s) => s.label === selectedSize) || sizes[1] || { priceMod: 0 };
  const unitPrice = product.price + sizeObj.priceMod;
  const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const totalPrice = (unitPrice + addonsTotal) * quantity;

  const toggleAddon = (addon: CartAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image,
        size: selectedSize,
        addons: selectedAddons,
        notes,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const cartCount = items.filter((i) => i.id.startsWith(product.id)).reduce((s, i) => s + i.quantity, 0);

  // Related products (same category, exclude current)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id && p.available).slice(0, 3);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Image */}
      <div className="relative">
        <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-amethyst-dark via-amethyst-dark/40 to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:left-6 lg:left-10 w-10 h-10 rounded-full bg-amethyst-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-amethyst-dark/70 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 right-4 sm:right-6 lg:right-10 bg-amethyst-royal text-white text-[10px] tracking-widest uppercase font-inter px-3 py-1.5 rounded-full shadow-lg shadow-amethyst-royal/30">
            {product.badge}
          </span>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8">
          <span className="text-amethyst-lavender/70 text-[10px] font-inter tracking-[0.3em] uppercase">{product.category}</span>
          <h1 className="font-podium text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mt-1 leading-tight">{product.name}</h1>
          <p className="text-amethyst-mauve/60 text-sm sm:text-base font-inter mt-2 max-w-2xl leading-relaxed">{product.desc}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Sizes + Addons + Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sizes */}
            <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 sm:p-6">
              <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase mb-4 font-semibold">{t.chooseSize}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sizes.map((size) => {
                  const active = selectedSize === size.label;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.label)}
                      className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-amethyst-royal/25 border-2 border-amethyst-lavender/50 text-white shadow-lg shadow-amethyst-royal/20'
                          : 'border border-amethyst-royal/15 text-amethyst-mauve/50 hover:border-amethyst-royal/40 hover:text-amethyst-mauve/80'
                      }`}
                    >
                      {active && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amethyst-royal rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className={`text-2xl transition-transform duration-200 ${active ? 'scale-110' : ''}`}>{size.icon}</span>
                      <span className="font-semibold text-sm">{size.label}</span>
                      <span className="text-xs opacity-50">{size.desc}</span>
                      <span className={`text-xs font-bold ${active ? 'text-amethyst-lavender' : 'text-amethyst-mauve/40'}`}>
                        {size.priceMod === 0 ? t.base : size.priceMod > 0 ? `+$${size.priceMod.toFixed(2)}` : `-$${Math.abs(size.priceMod).toFixed(2)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Addons */}
            <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 sm:p-6">
              <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase mb-4 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amethyst-lavender" />
                {t.addons}
                {selectedAddons.length > 0 && (
                  <span className="text-amethyst-lavender text-[10px] ml-1">({selectedAddons.length} selected)</span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addons.map((addon) => {
                  const selected = selectedAddons.some((a) => a.name === addon.name);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                        selected
                          ? 'bg-amethyst-royal/25 border border-amethyst-lavender/40 text-white shadow-md shadow-amethyst-royal/10'
                          : 'border border-amethyst-royal/10 text-amethyst-mauve/50 hover:border-amethyst-royal/30 hover:text-amethyst-mauve/80'
                      }`}
                    >
                      <span className="text-lg">{addon.emoji}</span>
                      <span className="flex-1 text-left text-sm font-inter">{addon.name}</span>
                      <span className={`text-xs font-inter ${selected ? 'text-amethyst-lavender' : 'text-amethyst-mauve/30'}`}>
                        +${addon.price.toFixed(2)}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        selected ? 'bg-amethyst-royal border-amethyst-lavender' : 'border-amethyst-royal/20'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 sm:p-6">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-2 text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold w-full"
              >
                <MessageSquare className="w-4 h-4 text-amethyst-lavender" />
                {t.specialNotes}
                {notes && <span className="text-amethyst-lavender text-[10px] normal-case tracking-normal ml-1">— added</span>}
                <span className="ml-auto">{showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
              </button>
              {showNotes && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  rows={3}
                  className="mt-4 w-full bg-amethyst-dark/60 border border-amethyst-royal/15 rounded-xl px-4 py-3 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-all resize-none"
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 sm:p-6 space-y-5">
              <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold">Order Summary</h2>

              {/* Selected size */}
              <div className="flex justify-between text-sm font-inter">
                <span className="text-amethyst-mauve/60">{selectedSize}</span>
                <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
              </div>

              {/* Size modifier */}
              {sizeObj.priceMod !== 0 && (
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-amethyst-mauve/60">{t.chooseSize} modifier</span>
                  <span className={sizeObj.priceMod > 0 ? 'text-amber-400' : 'text-green-400'}>
                    {sizeObj.priceMod > 0 ? '+' : ''}${sizeObj.priceMod.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Selected addons */}
              {selectedAddons.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-amethyst-mauve/40 font-inter text-[10px] uppercase tracking-wider">{t.addons}</p>
                  {selectedAddons.map((a) => (
                    <div key={a.name} className="flex justify-between text-sm font-inter">
                      <span className="text-amethyst-mauve/60">{a.name}</span>
                      <span className="text-amethyst-lavender">+${a.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes preview */}
              {notes && (
                <div className="bg-amethyst-dark/40 rounded-lg px-3 py-2">
                  <p className="text-amethyst-mauve/40 font-inter text-[10px] uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-amethyst-mauve/60 font-inter text-xs italic">&ldquo;{notes}&rdquo;</p>
                </div>
              )}

              <div className="border-t border-amethyst-royal/10 pt-4">
                {/* Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amethyst-mauve/60 font-inter text-sm">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-white font-inter text-base w-8 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-inter font-semibold">Total</span>
                  <span className="text-white font-inter text-3xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Add button */}
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`w-full flex items-center justify-center gap-2 py-4 text-xs tracking-[0.15em] uppercase font-inter rounded-xl transition-all duration-300 font-semibold ${
                    added
                      ? 'bg-green-600/90 text-white'
                      : 'bg-gradient-to-r from-amethyst-royal to-amethyst-velvet text-white shadow-lg shadow-amethyst-royal/30 active:scale-[0.97]'
                  }`}
                >
                  {added ? <><Check className="w-5 h-5" />{t.addedToOrder}</> : <>{t.addToOrder} — ${totalPrice.toFixed(2)}</>}
                </button>

                {cartCount > 0 && (
                  <p className="text-center text-amethyst-mauve/40 font-inter text-xs mt-2">
                    {cartCount} already in your cart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="font-podium text-white text-2xl uppercase tracking-tight mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/menu/${p.id}`}
                  className="group bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl overflow-hidden hover:border-amethyst-royal/30 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amethyst-dark/50 to-transparent" />
                    {p.badge && <span className="absolute top-3 left-3 bg-amethyst-royal text-white text-[10px] tracking-widest uppercase font-inter px-2.5 py-1 rounded-full">{p.badge}</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-podium text-white text-base uppercase tracking-tight">{p.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-amethyst-lavender font-inter font-bold">${p.price.toFixed(2)}</span>
                      <span className="text-amethyst-mauve/40 text-xs font-inter group-hover:text-amethyst-lavender transition-colors flex items-center gap-1">
                        View <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
