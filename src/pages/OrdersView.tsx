import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Clock, Phone, MapPin, CreditCard, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useOrdersAuth } from './OrdersLogin';

interface Order {
  id: number;
  customerName: string;
  phone: string;
  altPhone: string;
  address: string;
  apartment: string;
  city: string;
  landmark: string;
  deliveryTime: string;
  paymentMethod: string;
  orderNotes: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size: string;
    addons: Array<{ name: string; price: number }>;
    notes: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-400',
  confirmed: 'bg-blue-600/20 text-blue-400',
  preparing: 'bg-purple-600/20 text-purple-400',
  delivered: 'bg-green-600/20 text-green-400',
  cancelled: 'bg-red-600/20 text-red-400',
};

export default function OrdersPage() {
  const { logout } = useOrdersAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrders(data.map((o: Record<string, unknown>) => ({
        id: o.id as number,
        customerName: o.customer_name as string,
        phone: o.phone as string,
        altPhone: (o.alt_phone as string) || '',
        address: o.address as string,
        apartment: (o.apartment as string) || '',
        city: o.city as string,
        landmark: (o.landmark as string) || '',
        deliveryTime: (o.delivery_time as string) || 'asap',
        paymentMethod: (o.payment_method as string) || 'cash',
        orderNotes: (o.order_notes as string) || '',
        items: (o.items as Order['items']) || [],
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.delivery_fee),
        total: Number(o.total),
        status: (o.status as string) || 'pending',
        createdAt: o.created_at as string,
      })));
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/orders/login';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amethyst-royal/30 border-t-amethyst-lavender rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-podium text-white text-2xl sm:text-3xl uppercase tracking-tight">Orders</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-amethyst-royal/20 text-amethyst-mauve/50 hover:text-red-400 hover:border-red-400/30 font-inter text-xs rounded-xl transition-colors">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-12 h-12 text-amethyst-royal/30 mb-4" />
          <p className="text-amethyst-mauve/50 font-inter text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const date = new Date(order.createdAt);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const isOpen = expanded === order.id;

            return (
              <div key={order.id} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : order.id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-amethyst-royal/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amethyst-royal/20 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-amethyst-lavender" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-inter text-sm font-semibold">#{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-inter ${statusColors[order.status] || 'bg-gray-600/20 text-gray-400'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-amethyst-mauve/40 font-inter text-xs mt-0.5">{order.customerName} · {dateStr} {timeStr}</p>
                  </div>
                  <span className="text-amethyst-lavender font-inter text-lg font-bold">${order.total.toFixed(2)}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-amethyst-mauve/40" /> : <ChevronDown className="w-4 h-4 text-amethyst-mauve/40" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-amethyst-royal/10 pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-amethyst-mauve/60 text-xs font-inter">
                        <User className="w-3.5 h-3.5 text-amethyst-lavender shrink-0" />{order.customerName}
                      </div>
                      <div className="flex items-center gap-2 text-amethyst-mauve/60 text-xs font-inter">
                        <Phone className="w-3.5 h-3.5 text-amethyst-lavender shrink-0" />{order.phone}
                      </div>
                      <div className="flex items-center gap-2 text-amethyst-mauve/60 text-xs font-inter">
                        <MapPin className="w-3.5 h-3.5 text-amethyst-lavender shrink-0" />{order.address}{order.apartment ? `, ${order.apartment}` : ''}, {order.city}
                      </div>
                      <div className="flex items-center gap-2 text-amethyst-mauve/60 text-xs font-inter">
                        <Clock className="w-3.5 h-3.5 text-amethyst-lavender shrink-0" />{order.deliveryTime}
                      </div>
                      <div className="flex items-center gap-2 text-amethyst-mauve/60 text-xs font-inter">
                        <CreditCard className="w-3.5 h-3.5 text-amethyst-lavender shrink-0" />{order.paymentMethod}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-inter text-xs font-semibold uppercase tracking-wider">Items</h4>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-xs font-inter">
                          <div>
                            <span className="text-white">{item.name}</span>
                            <span className="text-amethyst-mauve/40 ml-1">x{item.quantity}</span>
                            <span className="text-amethyst-mauve/30 ml-1">({item.size})</span>
                            {item.addons.length > 0 && (
                              <span className="text-amethyst-lavender/50 ml-1">+ {item.addons.map((a) => a.name).join(', ')}</span>
                            )}
                          </div>
                          <span className="text-amethyst-mauve/60">${((item.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.orderNotes && (
                      <p className="text-amethyst-mauve/40 font-inter text-xs italic">"{order.orderNotes}"</p>
                    )}

                    <div className="border-t border-amethyst-royal/10 pt-3 space-y-1">
                      <div className="flex justify-between text-xs font-inter">
                        <span className="text-amethyst-mauve/50">Subtotal</span>
                        <span className="text-white">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-inter">
                        <span className="text-amethyst-mauve/50">Delivery</span>
                        <span className="text-amethyst-mauve/60">{order.deliveryFee === 0 ? 'Free' : `$${order.deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-inter font-bold pt-1">
                        <span className="text-white">Total</span>
                        <span className="text-amethyst-lavender">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
