import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-amethyst-dark border-l border-amethyst-royal/20 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amethyst-royal/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amethyst-lavender" />
            <h2 className="font-podium text-white text-lg uppercase tracking-wider">Cart</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-amethyst-mauve/60 hover:text-amethyst-mauve transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-12 h-12 text-amethyst-royal/30 mb-4" />
              <p className="text-amethyst-mauve/50 font-inter text-sm">Your cart is empty</p>
              <p className="text-amethyst-mauve/30 font-inter text-xs mt-1">Add some radical slices!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const addonsTotal = item.addons.reduce((s, a) => s + a.price, 0);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-inter text-white text-sm font-semibold truncate">{item.name}</h3>
                        <span className="text-amethyst-lavender font-inter text-sm font-bold shrink-0">
                          ${((item.price + addonsTotal) * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <p className="text-amethyst-mauve/40 font-inter text-[11px] mt-0.5">
                        {item.size} · ${item.price.toFixed(2)}
                      </p>

                      {item.addons.length > 0 && (
                        <p className="text-amethyst-lavender/50 font-inter text-[11px] mt-0.5 truncate">
                          + {item.addons.map((a) => a.name).join(', ')}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-amethyst-mauve/30 font-inter text-[10px] mt-0.5 italic truncate">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-amethyst-royal/30 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-inter text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-amethyst-royal/30 flex items-center justify-center text-amethyst-mauve/60 hover:text-white hover:border-amethyst-royal transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-amethyst-mauve/40 hover:text-red-400 transition-colors text-xs font-inter"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-amethyst-royal/20 bg-amethyst-dark">
            <div className="flex justify-between items-center mb-4">
              <span className="text-amethyst-mauve/60 font-inter text-sm">Total</span>
              <span className="text-white font-inter text-xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-amethyst-royal hover:bg-amethyst-velvet text-white py-3.5 text-xs tracking-widest uppercase font-inter rounded-bubble transition-colors duration-300 animate-pulse-glow">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-amethyst-mauve/40 hover:text-amethyst-mauve font-inter text-xs py-2 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
