import { useState, useEffect } from 'react';
import { X, Minus, Plus, Check, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart, type CartAddon } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';

export interface PizzaOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

interface PizzaModalProps {
  pizza: PizzaOption;
  onClose: () => void;
}

export default function PizzaModal({ pizza, onClose }: PizzaModalProps) {
  const { addItem } = useCart();
  const { t } = useLang();
  const { sizes, addons } = useAdmin();

  const [selectedSize, setSelectedSize] = useState(sizes[1]?.label || 'Medium');
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const sizeObj = sizes.find((s) => s.label === selectedSize) || sizes[1] || { priceMod: 0 };
  const unitPrice = pizza.price + sizeObj.priceMod;
  const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const totalPrice = (unitPrice + addonsTotal) * quantity;

  const toggleAddon = (addon: CartAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: pizza.id,
        name: pizza.name,
        price: unitPrice,
        image: pizza.image,
        size: selectedSize,
        addons: selectedAddons,
        notes,
      });
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      handleClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Mobile: bottom sheet | Desktop: centered card */}
      <div
        className={`
          absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:max-w-lg
          transition-all duration-300 ease-out
          ${visible
            ? 'translate-y-0 sm:scale-100 opacity-100'
            : 'translate-y-full sm:translate-y-0 sm:-translate-y-1/2 sm:scale-90 opacity-0'
          }
        `}
      >
        <div
          className="bg-amethyst-dark/95 backdrop-blur-xl border border-amethyst-royal/25 shadow-2xl shadow-black/40 sm:shadow-amethyst-royal/20 sm:rounded-[2rem] rounded-t-[2rem] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle on mobile */}
          <div className="flex justify-center pt-2 pb-0 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-amethyst-mauve/20" />
          </div>

          {/* Compact Header: image + title side by side */}
          <div className="flex items-center gap-4 px-4 sm:px-5 pt-3 sm:pt-5 pb-3">
            {/* Small image */}
            <div className="relative shrink-0">
              <img src={pizza.image} alt={pizza.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
              {pizza.badge && (
                <span className="absolute -top-1 -left-1 bg-amethyst-royal text-white text-[8px] tracking-wider uppercase font-inter px-1.5 py-0.5 rounded-full">
                  {pizza.badge}
                </span>
              )}
            </div>
            {/* Title + close */}
            <div className="flex-1 min-w-0">
              <span className="text-amethyst-lavender/70 text-[10px] font-inter tracking-[0.2em] uppercase">{pizza.category}</span>
              <h2 className="font-podium text-white text-lg sm:text-2xl uppercase tracking-tight leading-tight">{pizza.name}</h2>
              <p className="text-amethyst-mauve/50 text-[11px] font-inter mt-0.5 line-clamp-1">{pizza.desc}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-amethyst-dark-2/60 border border-amethyst-royal/15 flex items-center justify-center text-amethyst-mauve/50 hover:text-white hover:border-amethyst-royal/40 transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sizes — always visible, compact */}
          <div className="px-4 sm:px-5 pb-3">
            <h3 className="text-white/70 font-inter text-[10px] tracking-[0.15em] uppercase mb-2 font-semibold">{t.chooseSize}</h3>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {sizes.map((size) => {
                const active = selectedSize === size.label;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.label)}
                    className={`relative flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg sm:rounded-xl text-xs font-inter transition-all duration-200 ${
                      active
                        ? 'bg-amethyst-royal/25 border border-amethyst-lavender/50 text-white shadow-md shadow-amethyst-royal/15'
                        : 'border border-amethyst-royal/15 text-amethyst-mauve/50'
                    }`}
                  >
                    {active && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amethyst-royal rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                    <span className="text-sm sm:text-base">{size.icon}</span>
                    <span className="font-semibold text-[10px]">{size.label}</span>
                    <span className="text-[8px] opacity-50">{size.desc}</span>
                    <span className={`text-[9px] font-semibold ${active ? 'text-amethyst-lavender' : 'text-amethyst-mauve/40'}`}>
                      {size.priceMod === 0 ? t.base : size.priceMod > 0 ? `+$${size.priceMod}` : `-$${Math.abs(size.priceMod)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Addons — always visible, compact grid */}
          <div className="px-4 sm:px-5 pb-3">
            <h3 className="text-white/70 font-inter text-[10px] tracking-[0.15em] uppercase mb-2 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amethyst-lavender" />
              {t.addons}
              {selectedAddons.length > 0 && (
                <span className="text-amethyst-lavender ml-1">({selectedAddons.length})</span>
              )}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {addons.map((addon) => {
                const selected = selectedAddons.some((a) => a.name === addon.name);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-lg sm:rounded-xl text-[11px] font-inter transition-all duration-200 ${
                      selected
                        ? 'bg-amethyst-royal/30 border border-amethyst-lavender/50 text-white'
                        : 'border border-amethyst-royal/15 text-amethyst-mauve/50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{addon.emoji}</span>
                    <span className="truncate flex-1 text-left">{addon.name}</span>
                    {selected && (
                      <Check className="w-3 h-3 text-amethyst-lavender shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes — collapsible */}
          <div className="px-4 sm:px-5 pb-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1.5 text-white/70 font-inter text-[10px] tracking-[0.15em] uppercase font-semibold hover:text-white transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-amethyst-lavender" />
              {t.specialNotes}
              {notes && <span className="text-amethyst-lavender text-[9px] normal-case tracking-normal">({t.specialNotes})</span>}
              {showNotes ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={1}
                className="mt-2 w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-lg px-3 py-2 text-xs text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-all resize-none"
                autoFocus
              />
            )}
          </div>

          {/* Footer: quantity + price + add button */}
          <div className="px-4 sm:px-5 py-3 border-t border-amethyst-royal/10 bg-amethyst-dark/60">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 active:text-white active:border-amethyst-royal transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white font-inter text-sm w-6 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 active:text-white active:border-amethyst-royal transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-amethyst-mauve/40 font-inter text-[9px] uppercase tracking-wider">{t.total}</p>
                <p className="text-white font-inter text-xl font-bold">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={added}
              className={`w-full flex items-center justify-center gap-2 py-3.5 text-xs tracking-[0.15em] uppercase font-inter rounded-xl transition-all duration-300 font-semibold ${
                added
                  ? 'bg-green-600/90 text-white scale-[0.98]'
                  : 'bg-gradient-to-r from-amethyst-royal to-amethyst-velvet text-white shadow-lg shadow-amethyst-royal/30 active:scale-[0.97]'
              }`}
            >
              {added ? <><Check className="w-4 h-4" />{t.addedToOrder}</> : <>{t.addToOrder} — ${totalPrice.toFixed(2)}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
