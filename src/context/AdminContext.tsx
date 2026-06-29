import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdminSize {
  id: string;
  label: string;
  desc: string;
  priceMod: number;
  icon: string;
}

export interface AdminAddon {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  image?: string;
}

export interface AdminAddonCategory {
  id: string;
  name: string;
}

export interface AdminCategory {
  id: string;
  name: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
  available: boolean;
}

export interface AdminOrder {
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
  couponCode: string;
  discount: number;
  createdAt: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

interface AdminContextType {
  products: AdminProduct[];
  sizes: AdminSize[];
  addons: AdminAddon[];
  addonCategories: AdminAddonCategory[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  coupons: AdminCoupon[];
  addProduct: (p: Omit<AdminProduct, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSize: (s: Omit<AdminSize, 'id'>) => Promise<void>;
  updateSize: (id: string, s: Partial<AdminSize>) => Promise<void>;
  deleteSize: (id: string) => Promise<void>;
  addAddon: (a: Omit<AdminAddon, 'id'>) => Promise<void>;
  updateAddon: (id: string, a: Partial<AdminAddon>) => Promise<void>;
  deleteAddon: (id: string) => Promise<void>;
  addAddonCategory: (name: string) => Promise<void>;
  deleteAddonCategory: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  addCoupon: (c: Omit<AdminCoupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, c: Partial<AdminCoupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

function genId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sizes, setSizes] = useState<AdminSize[]>([]);
  const [addons, setAddons] = useState<AdminAddon[]>([]);
  const [addonCategories, setAddonCategories] = useState<AdminAddonCategory[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      await fetchAllData();
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllData() {
    const [prodRes, sizeRes, catRes, addonRes, prodCatRes, orderRes, couponRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at'),
      supabase.from('sizes').select('*').order('created_at'),
      supabase.from('addon_categories').select('*').order('created_at'),
      supabase.from('addons').select('*').order('created_at'),
      supabase.from('categories').select('*').order('created_at'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('coupons').select('*').order('created_at', { ascending: false }),
    ]);

    if (prodRes.data) {
      setProducts(prodRes.data.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: p.name as string,
        desc: (p.desc as string) || '',
        price: Number(p.price),
        category: p.category as string,
        image: (p.image as string) || '/Pizza.jpeg',
        badge: (p.badge as string) || undefined,
        available: p.available as boolean,
      })));
    }
    if (sizeRes.data) {
      setSizes(sizeRes.data.map((s: Record<string, unknown>) => ({
        id: s.id as string,
        label: s.label as string,
        desc: (s.desc as string) || '',
        priceMod: Number(s.price_mod),
        icon: (s.icon as string) || '🍕',
      })));
    }
    if (catRes.data) {
      setAddonCategories(catRes.data.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        name: c.name as string,
      })));
    }
    if (addonRes.data) {
      setAddons(addonRes.data.map((a: Record<string, unknown>) => ({
        id: a.id as string,
        name: a.name as string,
        price: Number(a.price),
        emoji: (a.emoji as string) || '',
        category: (a.category as string) || '',
        image: (a.image as string) || undefined,
      })));
    }
    if (prodCatRes.data) {
      setCategories(prodCatRes.data.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        name: c.name as string,
      })));
    }
    if (orderRes.data) {
      setOrders(orderRes.data.map((o: Record<string, unknown>) => ({
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
        items: (o.items as AdminOrder['items']) || [],
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.delivery_fee),
        total: Number(o.total),
        status: (o.status as string) || 'pending',
        couponCode: (o.coupon_code as string) || '',
        discount: Number(o.discount) || 0,
        createdAt: o.created_at as string,
      })));
    }
    if (couponRes.data) {
      setCoupons(couponRes.data.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        code: c.code as string,
        discountType: c.discount_type as 'percentage' | 'fixed',
        discountValue: Number(c.discount_value),
        minOrder: Number(c.min_order) || 0,
        maxUses: c.max_uses !== null ? Number(c.max_uses) : null,
        usedCount: Number(c.used_count) || 0,
        active: c.active as boolean,
        expiresAt: (c.expires_at as string) || null,
      })));
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setIsLoggedIn(true);
    await fetchAllData();
    return {};
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProducts([]);
    setSizes([]);
    setAddons([]);
    setAddonCategories([]);
    setCategories([]);
    setOrders([]);
    setCoupons([]);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const addProduct = useCallback(async (p: Omit<AdminProduct, 'id'>) => {
    const id = genId(p.name);
    const { error } = await supabase.from('products').insert({ id, ...p });
    if (error) throw error;
    setProducts((prev) => [...prev, { ...p, id }]);
  }, []);

  const updateProduct = useCallback(async (id: string, p: Partial<AdminProduct>) => {
    const { error } = await supabase.from('products').update(p).eq('id', id);
    if (error) throw error;
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSize = useCallback(async (s: Omit<AdminSize, 'id'>) => {
    const id = genId(s.label);
    const { error } = await supabase.from('sizes').insert({ id, label: s.label, desc: s.desc, price_mod: s.priceMod, icon: s.icon });
    if (error) throw error;
    setSizes((prev) => [...prev, { ...s, id }]);
  }, []);

  const updateSize = useCallback(async (id: string, s: Partial<AdminSize>) => {
    const dbUpdate: Record<string, unknown> = {};
    if (s.label !== undefined) dbUpdate.label = s.label;
    if (s.desc !== undefined) dbUpdate.desc = s.desc;
    if (s.priceMod !== undefined) dbUpdate.price_mod = s.priceMod;
    if (s.icon !== undefined) dbUpdate.icon = s.icon;
    const { error } = await supabase.from('sizes').update(dbUpdate).eq('id', id);
    if (error) throw error;
    setSizes((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  }, []);

  const deleteSize = useCallback(async (id: string) => {
    const { error } = await supabase.from('sizes').delete().eq('id', id);
    if (error) throw error;
    setSizes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addAddon = useCallback(async (a: Omit<AdminAddon, 'id'>) => {
    const id = genId(a.name);
    const { error } = await supabase.from('addons').insert({ id, name: a.name, price: a.price, emoji: a.emoji, category: a.category, image: a.image });
    if (error) throw error;
    setAddons((prev) => [...prev, { ...a, id }]);
  }, []);

  const updateAddon = useCallback(async (id: string, a: Partial<AdminAddon>) => {
    const { error } = await supabase.from('addons').update(a).eq('id', id);
    if (error) throw error;
    setAddons((prev) => prev.map((item) => (item.id === id ? { ...item, ...a } : item)));
  }, []);

  const deleteAddon = useCallback(async (id: string) => {
    const { error } = await supabase.from('addons').delete().eq('id', id);
    if (error) throw error;
    setAddons((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addAddonCategory = useCallback(async (name: string) => {
    const id = genId(name);
    const { error } = await supabase.from('addon_categories').insert({ id, name });
    if (error) throw error;
    setAddonCategories((prev) => [...prev, { id, name }]);
  }, []);

  const deleteAddonCategory = useCallback(async (id: string) => {
    const { error } = await supabase.from('addon_categories').delete().eq('id', id);
    if (error) throw error;
    setAddonCategories((prev) => prev.filter((c) => c.id !== id));
    setAddons((prev) => prev.map((a) => (a.category === id ? { ...a, category: 'other' } : a)));
  }, []);

  const addCategory = useCallback(async (name: string) => {
    const id = genId(name);
    const { error } = await supabase.from('categories').insert({ id, name });
    if (error) throw error;
    setCategories((prev) => [...prev, { id, name }]);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateOrderStatus = useCallback(async (id: number, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const deleteOrder = useCallback(async (id: number) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const addCoupon = useCallback(async (c: Omit<AdminCoupon, 'id' | 'usedCount'>) => {
    const id = genId(c.code);
    const { error } = await supabase.from('coupons').insert({
      id,
      code: c.code.toUpperCase(),
      discount_type: c.discountType,
      discount_value: c.discountValue,
      min_order: c.minOrder,
      max_uses: c.maxUses,
      active: c.active,
      expires_at: c.expiresAt,
    });
    if (error) throw error;
    setCoupons((prev) => [...prev, { ...c, id, code: c.code.toUpperCase(), usedCount: 0 }]);
  }, []);

  const updateCoupon = useCallback(async (id: string, c: Partial<AdminCoupon>) => {
    const dbUpdate: Record<string, unknown> = {};
    if (c.code !== undefined) dbUpdate.code = c.code.toUpperCase();
    if (c.discountType !== undefined) dbUpdate.discount_type = c.discountType;
    if (c.discountValue !== undefined) dbUpdate.discount_value = c.discountValue;
    if (c.minOrder !== undefined) dbUpdate.min_order = c.minOrder;
    if (c.maxUses !== undefined) dbUpdate.max_uses = c.maxUses;
    if (c.active !== undefined) dbUpdate.active = c.active;
    if (c.expiresAt !== undefined) dbUpdate.expires_at = c.expiresAt;
    const { error } = await supabase.from('coupons').update(dbUpdate).eq('id', id);
    if (error) throw error;
    setCoupons((prev) => prev.map((item) => (item.id === id ? { ...item, ...c, code: (c.code || item.code).toUpperCase() } : item)));
  }, []);

  const deleteCoupon = useCallback(async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <AdminContext.Provider value={{
      products, sizes, addons, addonCategories, categories, orders, coupons,
      addProduct, updateProduct, deleteProduct,
      addSize, updateSize, deleteSize,
      addAddon, updateAddon, deleteAddon,
      addAddonCategory, deleteAddonCategory,
      addCategory, deleteCategory,
      updateOrderStatus, deleteOrder,
      addCoupon, updateCoupon, deleteCoupon,
      uploadImage,
      isLoggedIn, isLoading, login, logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
