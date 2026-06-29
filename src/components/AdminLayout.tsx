import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Pizza, Ruler, Plus, LayoutDashboard, LogOut, Menu, X, ChevronRight, Tag, Package, DollarSign, Ticket } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Pizza, label: 'Products', to: '/admin/products' },
  { icon: Tag, label: 'Categories', to: '/admin/categories' },
  { icon: Ruler, label: 'Sizes', to: '/admin/sizes' },
  { icon: Plus, label: 'Add-ons', to: '/admin/addons' },
  { icon: Ticket, label: 'Coupons', to: '/admin/coupons' },
  { icon: Package, label: 'Orders', to: '/admin/orders' },
  { icon: DollarSign, label: 'Salary', to: '/admin/salary' },
];

export default function AdminLayout() {
  const { isLoggedIn, logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 left-4 z-30 md:hidden w-10 h-10 rounded-xl bg-amethyst-dark-2/80 backdrop-blur border border-amethyst-royal/20 flex items-center justify-center text-amethyst-mauve"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen w-64 bg-amethyst-dark-2/60 backdrop-blur-xl border-r border-amethyst-royal/15 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-amethyst-royal/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amethyst-royal/20 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-amethyst-lavender" />
            </div>
            <span className="font-inter text-white font-bold text-sm tracking-wider uppercase">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-amethyst-mauve/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter transition-all duration-200 ${
                  active
                    ? 'bg-amethyst-royal/20 text-white border border-amethyst-royal/20'
                    : 'text-amethyst-mauve/60 hover:text-amethyst-mauve hover:bg-amethyst-royal/10'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-amethyst-royal/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter text-amethyst-mauve/60 hover:text-amethyst-mauve hover:bg-amethyst-royal/10 transition-all"
          >
            <Pizza className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
