import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';

export default function OrderPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();
  const deliveryFee = totalPrice >= 25 ? 0 : 3.99;

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto">
      {/* Hero Image */}
      <div className="mb-10 rounded-bubble-xl overflow-hidden border border-amethyst-royal/15">
        <img src="/cart.png" alt="Cart" className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover" />
      </div>

      <div className="mb-10">
        <Link to="/menu" className="inline-flex items-center gap-2 text-amethyst-mauve/50 hover:text-amethyst-mauve text-xs font-inter tracking-widest uppercase transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t.backToMenu}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.review}</span>
            <h1 className="font-podium text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mt-2">{t.yourOrder}</h1>
          </div>
          {items.length > 0 && (
            <span className="text-amethyst-mauve/40 font-inter text-sm">
              {totalItems} {totalItems === 1 ? t.item : t.items}
            </span>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-amethyst-royal/10 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-amethyst-royal/30" />
          </div>
          <h2 className="font-podium text-white text-xl uppercase tracking-tight mb-2">{t.cartEmpty}</h2>
          <p className="text-amethyst-mauve/40 font-inter text-sm mb-8 max-w-xs">{t.cartEmptyDesc}</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300">
            <ArrowUpRight className="w-4 h-4" />
            {t.browseMenu}
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="space-y-4 mb-10">
            {items.map((item) => {
              const addonsTotal = item.addons.reduce((s, a) => s + a.price, 0);
              const lineTotal = (item.price + addonsTotal) * item.quantity;
              return (
                <div key={item.id} className="flex gap-4 sm:gap-5 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-4 sm:p-5 hover:border-amethyst-royal/25 transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-podium text-white text-base sm:text-lg uppercase tracking-tight">{item.name}</h3>
                        <p className="text-amethyst-mauve/40 font-inter text-xs mt-0.5">{item.size} · ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-amethyst-lavender font-inter text-lg font-bold shrink-0">${lineTotal.toFixed(2)}</span>
                    </div>
                    {item.addons.length > 0 && <p className="text-amethyst-lavender/50 font-inter text-xs mt-1.5">+ {item.addons.map((a) => `${a.name} ($${a.price.toFixed(2)})`).join(', ')}</p>}
                    {item.notes && <p className="text-amethyst-mauve/30 font-inter text-xs mt-1 italic">&ldquo;{item.notes}&rdquo;</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-white font-inter text-sm w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-amethyst-royal/25 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-amethyst-mauve/30 hover:text-red-400 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-amethyst-royal/15 pt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-amethyst-mauve/50 font-inter text-sm">{t.subtotal}</span>
              <span className="text-white font-inter text-lg font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amethyst-mauve/50 font-inter text-sm">{t.delivery}</span>
              <span className="text-amethyst-lavender font-inter text-sm">{deliveryFee === 0 ? t.free : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-amethyst-royal/10">
              <span className="text-white font-inter text-base font-semibold">{t.total}</span>
              <span className="text-white font-inter text-2xl font-bold">${(totalPrice + deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button onClick={() => navigate('/checkout')} className="flex-1 bg-gradient-to-r from-amethyst-royal to-amethyst-velvet hover:from-amethyst-velvet hover:to-amethyst-royal text-white py-4 text-xs tracking-[0.2em] uppercase font-inter rounded-2xl transition-all duration-300 shadow-lg shadow-amethyst-royal/30 font-semibold">{t.checkout}</button>
              <button onClick={clearCart} className="sm:w-auto px-6 py-4 border border-amethyst-royal/20 text-amethyst-mauve/40 hover:text-red-400 hover:border-red-400/30 font-inter text-xs tracking-widest uppercase rounded-2xl transition-all duration-300">{t.clearAll}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
