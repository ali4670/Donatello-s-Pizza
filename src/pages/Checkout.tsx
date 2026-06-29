import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Truck, Clock, Phone, User, MapPin, FileText, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLang();

  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '', address: '', apartment: '', city: '', landmark: '', notes: '',
    paymentMethod: 'cash', deliveryTime: 'asap',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);

  const deliveryFee = totalPrice >= 25 ? 0 : 3.99;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? totalPrice * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const grandTotal = Math.max(0, totalPrice - discount + deliveryFee);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = t.nameRequired;
    if (!form.phone.trim()) newErrors.phone = t.phoneRequired;
    else if (!/^[0-9+\-\s()]{8,}$/.test(form.phone.trim())) newErrors.phone = t.invalidPhone;
    if (!form.address.trim()) newErrors.address = t.addressRequired;
    if (!form.city.trim()) newErrors.city = t.cityRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('active', true)
      .single();
    setCouponLoading(false);

    if (error || !data) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('This coupon has expired');
      setAppliedCoupon(null);
      return;
    }
    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      setCouponError('This coupon has reached its usage limit');
      setAppliedCoupon(null);
      return;
    }
    if (data.min_order > 0 && totalPrice < data.min_order) {
      setCouponError(`Minimum order is $${data.min_order.toFixed(2)}`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code: data.code, type: data.discount_type, value: data.discount_value });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await supabase.from('orders').insert({
      customer_name: form.name,
      phone: form.phone,
      alt_phone: form.altPhone,
      address: form.address,
      apartment: form.apartment,
      city: form.city,
      landmark: form.landmark,
      delivery_time: form.deliveryTime,
      payment_method: form.paymentMethod,
      order_notes: form.notes,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        addons: item.addons,
        notes: item.notes,
      })),
      subtotal: totalPrice,
      delivery_fee: deliveryFee,
      discount: discount,
      coupon_code: appliedCoupon?.code || null,
      total: grandTotal,
      status: 'pending',
    });
    if (appliedCoupon) {
      await supabase.rpc('increment_coupon_usage', { coupon_code: appliedCoupon.code });
    }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-lg mx-auto text-center">
        <div className="animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-500" /></div>
          <h1 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight">{t.orderPlaced}</h1>
          <p className="text-amethyst-mauve/60 font-inter text-base mt-4 leading-relaxed">{t.orderPlacedDesc.replace('{name}', form.name)}</p>
          <div className="mt-8 bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-6 text-left space-y-3">
            <div className="flex items-center gap-3 text-amethyst-mauve/60 text-sm font-inter"><MapPin className="w-4 h-4 text-amethyst-lavender shrink-0" /><span>{form.address}{form.apartment ? `, ${form.apartment}` : ''}, {form.city}</span></div>
            <div className="flex items-center gap-3 text-amethyst-mauve/60 text-sm font-inter"><Phone className="w-4 h-4 text-amethyst-lavender shrink-0" /><span>{form.phone}</span></div>
            <div className="flex items-center gap-3 text-amethyst-mauve/60 text-sm font-inter"><Clock className="w-4 h-4 text-amethyst-lavender shrink-0" /><span>{form.deliveryTime === 'asap' ? t.asap + ' (30-45 min)' : form.deliveryTime}</span></div>
            <div className="flex items-center gap-3 text-amethyst-mauve/60 text-sm font-inter"><CreditCard className="w-4 h-4 text-amethyst-lavender shrink-0" /><span className="capitalize">{form.paymentMethod === 'cash' ? t.cashOnDelivery : form.paymentMethod === 'card' ? t.creditDebit : t.mobilePayment}</span></div>
            <div className="pt-3 border-t border-amethyst-royal/10 flex justify-between items-center">
              <span className="text-white font-inter font-semibold">{t.totalPaid}</span>
              <span className="text-amethyst-lavender font-inter text-xl font-bold">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 mt-8 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300">{t.backToHome}</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-lg mx-auto text-center">
        <h1 className="font-podium text-white text-2xl uppercase tracking-tight mb-4">{t.nothingToCheckout}</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mb-8">{t.nothingToCheckoutDesc}</p>
        <Link to="/menu" className="inline-flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300">{t.browseMenu}</Link>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-3xl mx-auto">
      <Link to="/order" className="inline-flex items-center gap-2 text-amethyst-mauve/50 hover:text-amethyst-mauve text-xs font-inter tracking-widest uppercase transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />{t.backToMenu}
      </Link>
      <div className="mb-10">
        <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.almostThere}</span>
        <h1 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight mt-2">{t.checkout}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Details */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-amethyst-lavender" />{t.contactDetails}</h2>
          <div className="space-y-3">
            <div>
              <input type="text" placeholder={t.fullName} value={form.name} onChange={(e) => update('name', e.target.value)} className={`w-full bg-amethyst-dark-2/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${errors.name ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`} />
              {errors.name && <p className="text-red-400 text-xs font-inter mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="tel" placeholder={t.phoneNumber} value={form.phone} onChange={(e) => update('phone', e.target.value)} className={`w-full bg-amethyst-dark-2/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${errors.phone ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`} />
              {errors.phone && <p className="text-red-400 text-xs font-inter mt-1">{errors.phone}</p>}
            </div>
            <input type="tel" placeholder={t.altPhone} value={form.altPhone} onChange={(e) => update('altPhone', e.target.value)} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-colors" />
          </div>
        </section>

        {/* Delivery Address */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-amethyst-lavender" />{t.deliveryAddress}</h2>
          <div className="space-y-3">
            <div>
              <input type="text" placeholder={t.streetAddress} value={form.address} onChange={(e) => update('address', e.target.value)} className={`w-full bg-amethyst-dark-2/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${errors.address ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`} />
              {errors.address && <p className="text-red-400 text-xs font-inter mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder={t.apartmentFloor} value={form.apartment} onChange={(e) => update('apartment', e.target.value)} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-colors" />
              <div>
                <input type="text" placeholder={t.city} value={form.city} onChange={(e) => update('city', e.target.value)} className={`w-full bg-amethyst-dark-2/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${errors.city ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`} />
                {errors.city && <p className="text-red-400 text-xs font-inter mt-1">{errors.city}</p>}
              </div>
            </div>
            <input type="text" placeholder={t.landmark} value={form.landmark} onChange={(e) => update('landmark', e.target.value)} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-colors" />
          </div>
        </section>

        {/* Delivery Time */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amethyst-lavender" />{t.deliveryTime}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: 'asap', label: t.asap, desc: t.min30 },
              { value: '1 hour', label: t.hour1, desc: t.min60 },
              { value: '2 hours', label: t.hours2, desc: t.min120 },
              { value: 'scheduled', label: t.later, desc: t.pickTime },
            ].map((opt) => (
              <button type="button" key={opt.value} onClick={() => update('deliveryTime', opt.value)} className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-inter transition-all duration-200 ${form.deliveryTime === opt.value ? 'bg-amethyst-royal/25 border border-amethyst-lavender/50 text-white' : 'border border-amethyst-royal/15 text-amethyst-mauve/50 hover:border-amethyst-royal/40'}`}>
                <span className="font-semibold">{opt.label}</span>
                <span className="text-[10px] opacity-50">{opt.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-amethyst-lavender" />{t.paymentMethod}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { value: 'cash', label: t.cashOnDelivery, icon: '💵' },
              { value: 'card', label: t.creditDebit, icon: '💳' },
              { value: 'mobile', label: t.mobilePayment, icon: '📱' },
            ].map((opt) => (
              <button type="button" key={opt.value} onClick={() => update('paymentMethod', opt.value)} className={`flex items-center gap-3 py-3.5 px-4 rounded-xl text-xs font-inter transition-all duration-200 ${form.paymentMethod === opt.value ? 'bg-amethyst-royal/25 border border-amethyst-lavender/50 text-white' : 'border border-amethyst-royal/15 text-amethyst-mauve/50 hover:border-amethyst-royal/40'}`}>
                <span className="text-lg">{opt.icon}</span>
                <span className="font-semibold">{opt.label}</span>
                {form.paymentMethod === opt.value && <div className="ml-auto w-4 h-4 bg-amethyst-royal rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
              </button>
            ))}
          </div>
        </section>

        {/* Order Notes */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-amethyst-lavender" />{t.orderNotes}</h2>
          <textarea placeholder={t.orderNotesPlaceholder} value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} className="w-full bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-colors resize-none" />
        </section>

        {/* Coupon Code */}
        <section>
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-amethyst-lavender" />Coupon Code</h2>
          {appliedCoupon ? (
            <div className="flex items-center gap-3 bg-green-600/10 border border-green-500/30 rounded-xl px-4 py-3">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-green-400 font-inter text-sm font-semibold">{appliedCoupon.code}</span>
              <span className="text-green-400/70 font-inter text-xs">
                {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% OFF` : `$${appliedCoupon.value.toFixed(2)} OFF`}
              </span>
              <button onClick={removeCoupon} className="ml-auto text-amethyst-mauve/40 hover:text-red-400 text-xs font-inter transition-colors">Remove</button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                  placeholder="Enter coupon code"
                  className="flex-1 bg-amethyst-dark-2/50 border border-amethyst-royal/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none focus:border-amethyst-lavender/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-5 py-3.5 bg-amethyst-royal hover:bg-amethyst-velvet disabled:opacity-50 text-white text-xs tracking-widest uppercase font-inter rounded-xl transition-all duration-300"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-400 text-xs font-inter mt-1.5">{couponError}</p>}
            </div>
          )}
        </section>

        {/* Order Summary */}
        <section className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 space-y-3">
          <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-2">{t.orderSummary}</h2>
          {items.map((item) => {
            const addonsTotal = item.addons.reduce((s, a) => s + a.price, 0);
            return (
              <div key={item.id} className="flex justify-between items-start text-sm font-inter">
                <div><span className="text-white">{item.name}</span><span className="text-amethyst-mauve/40 ml-1">x{item.quantity}</span><span className="text-amethyst-mauve/30 ml-2 text-xs">({item.size})</span></div>
                <span className="text-amethyst-mauve/60">${((item.price + addonsTotal) * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="pt-3 border-t border-amethyst-royal/10 space-y-2">
            <div className="flex justify-between text-sm font-inter"><span className="text-amethyst-mauve/50">{t.subtotal}</span><span className="text-white">${totalPrice.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-sm font-inter"><span className="text-green-400/70">Discount ({appliedCoupon?.code})</span><span className="text-green-400">-${discount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-sm font-inter"><span className="text-amethyst-mauve/50">{t.delivery}</span><span className={deliveryFee === 0 ? 'text-green-500' : 'text-amethyst-mauve/60'}>{deliveryFee === 0 ? t.free : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between items-center pt-3 border-t border-amethyst-royal/10"><span className="text-white font-inter font-semibold">{t.total}</span><span className="text-white font-inter text-2xl font-bold">${grandTotal.toFixed(2)}</span></div>
          </div>
        </section>

        {/* Place Order */}
        <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 text-xs tracking-[0.2em] uppercase font-inter rounded-2xl font-semibold bg-gradient-to-r from-amethyst-royal to-amethyst-velvet hover:from-amethyst-velvet hover:to-amethyst-royal text-white shadow-lg shadow-amethyst-royal/30 hover:shadow-amethyst-royal/50 active:scale-[0.98] transition-all duration-300">
          <Truck className="w-4 h-4" />
          {t.placeOrder} — ${grandTotal.toFixed(2)}
        </button>
      </form>
    </div>
  );
}
