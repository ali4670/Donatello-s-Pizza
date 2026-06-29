import { useState } from 'react';
import { Package, Trash2, ChevronDown, ChevronUp, Clock, Phone, MapPin, CreditCard, User } from 'lucide-react';
import { useAdmin, type AdminOrder } from '@/context/AdminContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-400',
  confirmed: 'bg-blue-600/20 text-blue-400',
  preparing: 'bg-purple-600/20 text-purple-400',
  delivered: 'bg-green-600/20 text-green-400',
  cancelled: 'bg-red-600/20 text-red-400',
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = (id: number, status: string) => {
    updateOrderStatus(id, status);
  };

  const handleDelete = (id: number) => {
    deleteOrder(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-podium text-white text-2xl sm:text-3xl uppercase tracking-tight">Orders</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">Manage customer orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs font-inter tracking-wider uppercase rounded-full border transition-all ${
              filter === s
                ? 'bg-amethyst-royal text-white border-amethyst-royal'
                : 'border-amethyst-royal/20 text-amethyst-mauve/50 hover:border-amethyst-royal/50'
            }`}
          >
            {s} ({s === 'all' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-12 h-12 text-amethyst-royal/30 mb-4" />
          <p className="text-amethyst-mauve/50 font-inter text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expanded === order.id}
              onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              onStatusChange={handleStatusChange}
              onDelete={() => setDeleteConfirm(order.id)}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-amethyst-dark border border-amethyst-royal/20 rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-white font-inter font-semibold mb-2">Delete Order #{deleteConfirm}?</h3>
            <p className="text-amethyst-mauve/50 font-inter text-sm mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-amethyst-royal/20 text-amethyst-mauve/60 font-inter text-xs rounded-xl hover:border-amethyst-royal/50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-inter text-xs rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, onStatusChange, onDelete }: {
  order: AdminOrder;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: () => void;
}) {
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-amethyst-royal/5 transition-colors">
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
        {expanded ? <ChevronUp className="w-4 h-4 text-amethyst-mauve/40" /> : <ChevronDown className="w-4 h-4 text-amethyst-mauve/40" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-amethyst-royal/10 pt-4 space-y-4">
          {/* Customer info */}
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

          {/* Items */}
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

          {/* Order notes */}
          {order.orderNotes && (
            <p className="text-amethyst-mauve/40 font-inter text-xs italic">"{order.orderNotes}"</p>
          )}

          {/* Totals */}
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

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="bg-amethyst-dark-2/60 border border-amethyst-royal/20 text-white font-inter text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amethyst-lavender/40"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={onDelete} className="px-3 py-2 border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 font-inter text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
