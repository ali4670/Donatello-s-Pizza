import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LangProvider, useLang } from './context/LangContext';
import { AdminProvider } from './context/AdminContext';
import { OrdersAuthProvider } from './pages/OrdersLogin';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Story from './pages/Story';
import Contact from './pages/Contact';
import Locations from './pages/Locations';
import OrderPage from './pages/Order';
import CheckoutPage from './pages/Checkout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminSizes from './pages/admin/Sizes';
import AdminAddons from './pages/admin/Addons';
import AdminCategories from './pages/admin/Categories';
import AdminCoupons from './pages/admin/Coupons';
import AdminOrders from './pages/admin/Orders';
import AdminSalary from './pages/admin/Salary';
import ProductPage from './pages/ProductPage';
import OrdersLogin from './pages/OrdersLogin';
import OrdersView from './pages/OrdersView';

function AppRoutes() {
  const { dir } = useLang();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
  }, [dir]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<ProductPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/story" element={<Story />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/locations" element={<Locations />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<Layout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/sizes" element={<AdminSizes />} />
            <Route path="/admin/addons" element={<AdminAddons />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/salary" element={<AdminSalary />} />
          </Route>
        </Route>

        {/* Orders Routes */}
        <Route element={<Layout />}>
          <Route path="/orders/login" element={<OrdersAuthProvider><OrdersLogin /></OrdersAuthProvider>} />
          <Route path="/orders" element={<OrdersAuthProvider><OrdersView /></OrdersAuthProvider>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LangProvider>
      <AdminProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AdminProvider>
    </LangProvider>
  );
}

export default App;
