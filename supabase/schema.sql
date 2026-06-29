-- =============================================
-- Donatello's Pizza — Supabase Full Schema
-- =============================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "desc" TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Signature',
  image TEXT DEFAULT '/Pizza.jpeg',
  badge TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SIZES TABLE
CREATE TABLE IF NOT EXISTS sizes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  "desc" TEXT DEFAULT '',
  price_mod NUMERIC(10,2) DEFAULT 0,
  icon TEXT DEFAULT '🍕',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ADDON CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS addon_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ADDONS TABLE
CREATE TABLE IF NOT EXISTS addons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) DEFAULT 0,
  emoji TEXT DEFAULT '',
  category TEXT REFERENCES addon_categories(id) ON DELETE SET NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. STORAGE POLICIES (public read, authenticated write)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'objects') THEN
    CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated upload' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated update' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated update" ON storage.objects FOR UPDATE TO authenticated WITH CHECK (bucket_id = 'product-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated delete' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
  END IF;
END $$;

-- 7. ROW LEVEL SECURITY
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_categories ENABLE ROW LEVEL SECURITY;

-- Policies (skip if already exist)
DO $$
BEGIN
  -- Categories
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read categories') THEN
    CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert categories') THEN
    CREATE POLICY "Auth insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete categories') THEN
    CREATE POLICY "Auth delete categories" ON categories FOR DELETE TO authenticated USING (true);
  END IF;

  -- Products
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read products') THEN
    CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert products') THEN
    CREATE POLICY "Auth insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update products') THEN
    CREATE POLICY "Auth update products" ON products FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete products') THEN
    CREATE POLICY "Auth delete products" ON products FOR DELETE TO authenticated USING (true);
  END IF;

  -- Sizes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read sizes') THEN
    CREATE POLICY "Public read sizes" ON sizes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert sizes') THEN
    CREATE POLICY "Auth insert sizes" ON sizes FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update sizes') THEN
    CREATE POLICY "Auth update sizes" ON sizes FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete sizes') THEN
    CREATE POLICY "Auth delete sizes" ON sizes FOR DELETE TO authenticated USING (true);
  END IF;

  -- Addons
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read addons') THEN
    CREATE POLICY "Public read addons" ON addons FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert addons') THEN
    CREATE POLICY "Auth insert addons" ON addons FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update addons') THEN
    CREATE POLICY "Auth update addons" ON addons FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete addons') THEN
    CREATE POLICY "Auth delete addons" ON addons FOR DELETE TO authenticated USING (true);
  END IF;

  -- Addon Categories
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read addon_categories') THEN
    CREATE POLICY "Public read addon_categories" ON addon_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert addon_categories') THEN
    CREATE POLICY "Auth insert addon_categories" ON addon_categories FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update addon_categories') THEN
    CREATE POLICY "Auth update addon_categories" ON addon_categories FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete addon_categories') THEN
    CREATE POLICY "Auth delete addon_categories" ON addon_categories FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- 8. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'products_updated_at') THEN
    CREATE TRIGGER products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- =============================================
-- 9. SEED DATA — PRODUCT CATEGORIES
-- =============================================
INSERT INTO categories (id, name) VALUES
('signature', 'Signature'),
('classics',  'Classics'),
('specialty', 'Specialty')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 10. SEED DATA — PRODUCTS
-- =============================================
INSERT INTO products (id, name, "desc", price, category, image, badge, available) VALUES
('don-special',   'The Don Special',      'Pepperoni, Italian sausage, mushrooms, black olives, mozzarella',         18.99, 'Signature', '/Pizza.jpeg', 'Best Seller', true),
('purple-reign',  'Purple Reign',         'Grilled eggplant, roasted garlic, ricotta, fresh basil, balsamic glaze', 16.99, 'Signature', '/Pizza.jpeg', NULL,           true),
('shell-shock',   'Shell Shock',          'Spicy sopressata, hot honey, chili flakes, fresh mozzarella',            17.99, 'Signature', '/Pizza.jpeg', 'Spicy',        true),
('margherita',    'Classic Margherita',   'San Marzano tomatoes, fresh mozzarella, basil, EVOO',                    14.99, 'Classics',  '/Pizza.jpeg', NULL,           true),
('pepperoni',     'Pepperoni Power',      'Double pepperoni, mozzarella, signature tomato sauce',                   15.99, 'Classics',  '/Pizza.jpeg', NULL,           true),
('four-cheese',   'Four Cheese Fantasy',  'Mozzarella, gorgonzola, parmesan, fontina, honey drizzle',               17.99, 'Classics',  '/Pizza.jpeg', NULL,           true),
('bbq-chicken',   'BBQ Chicken Blaze',    'Grilled chicken, BBQ sauce, red onion, cilantro, smoked gouda',         16.99, 'Specialty', '/Pizza.jpeg', NULL,           true),
('veggie-bubble', 'Veggie Bubble',        'Bell peppers, artichokes, sun-dried tomatoes, spinach, feta',            15.99, 'Specialty', '/Pizza.jpeg', NULL,           true),
('truffle-shroom','Truffle Shroom',       'Wild mushroom mix, truffle oil, fontina, arugula, parmesan',             19.99, 'Specialty', '/Pizza.jpeg', 'Premium',      true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 11. SEED DATA — SIZES
-- =============================================
INSERT INTO sizes (id, label, "desc", price_mod, icon) VALUES
('small',  'Small',  '10"', -3, '🍕'),
('medium', 'Medium', '12"',  0, '🍕'),
('large',  'Large',  '14"',  3, '🍕'),
('xl',     'XL',     '16"',  6, '🍕')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 12. SEED DATA — ADDON CATEGORIES
-- =============================================
INSERT INTO addon_categories (id, name) VALUES
('cheese',  'Cheese'),
('meat',    'Meat'),
('veggies', 'Vegetables'),
('sauces',  'Sauces & Oils')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 13. SEED DATA — ADDONS
-- =============================================
INSERT INTO addons (id, name, price, emoji, category) VALUES
('extra-cheese', 'Extra Cheese', 1.50, '🧀', 'cheese'),
('pepperoni',    'Pepperoni',    2.00, '🥩', 'meat'),
('mushrooms',    'Mushrooms',    1.50, '🍄', 'veggies'),
('olives',       'Olives',       1.00, '🫒', 'veggies'),
('jalapenos',    'Jalapeños',    1.00, '🌶️', 'veggies'),
('bacon',        'Bacon',        2.50, '🥓', 'meat'),
('pineapple',    'Pineapple',    1.50, '🍍', 'veggies'),
('truffle-oil',  'Truffle Oil',  3.00, '✨', 'sauces')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 14. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  landmark TEXT,
  delivery_time TEXT DEFAULT 'asap',
  payment_method TEXT DEFAULT 'cash',
  order_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read orders') THEN
    CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert orders') THEN
    CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update orders') THEN
    CREATE POLICY "Auth update orders" ON orders FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete orders') THEN
    CREATE POLICY "Auth delete orders" ON orders FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 15. COUPONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read coupons') THEN
    CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert coupons') THEN
    CREATE POLICY "Auth insert coupons" ON coupons FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update coupons') THEN
    CREATE POLICY "Auth update coupons" ON coupons FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete coupons') THEN
    CREATE POLICY "Auth delete coupons" ON coupons FOR DELETE TO authenticated USING (true);
  END IF;
  -- Allow public to increment used_count (for coupon redemption)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public update coupons') THEN
    CREATE POLICY "Public update coupons" ON coupons FOR UPDATE USING (true);
  END IF;
END $$;

CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 16. ADD COUPON COLUMN TO ORDERS
-- =============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0;

-- =============================================
-- 17. CREATE ADMIN USER
-- Run this in Supabase SQL Editor after creating
-- the auth user via dashboard or auth API
-- =============================================
-- The admin user is created via Supabase Auth with:
-- Email: Doney2dmin3aly@Dony.com
-- Password: Dony13542
--
-- Use the Supabase Dashboard → Authentication → Users → Invite
-- or sign up via the app's login page.
