import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CartAddon {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  addons: CartAddon[];
  notes: string;
}

export interface AddItemPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  addons: CartAddon[];
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function buildCompositeId(item: AddItemPayload): string {
  const addonNames = item.addons.map((a) => a.name).sort().join(',');
  return `${item.id}_${item.size}_${addonNames}_${item.notes}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: AddItemPayload) => {
    const compositeId = buildCompositeId(item);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === compositeId);
      if (existing) {
        return prev.map((i) =>
          i.id === compositeId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: compositeId, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const addonsTotal = i.addons.reduce((s, a) => s + a.price, 0);
    return sum + (i.price + addonsTotal) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
