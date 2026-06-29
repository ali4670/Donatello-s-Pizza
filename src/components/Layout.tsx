import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import FloatingParticles from './FloatingParticles';

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-amethyst-dark flex flex-col perspective-container">
      <FloatingParticles />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bubble w-72 h-72 -top-24 -left-24 animate-float-3d opacity-30" />
        <div className="bubble w-[500px] h-[500px] -bottom-40 -right-40 animate-float-3d-slow opacity-20" />
        <div className="bubble w-48 h-48 top-1/4 right-1/4 animate-wobble opacity-15" />
        <div className="bubble-glow w-[600px] h-[600px] -top-64 left-1/4 opacity-20 animate-drift" />
        <div className="bubble-glow w-[400px] h-[400px] bottom-0 right-1/4 opacity-15 animate-drift-slow" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        <Footer />
      </div>

      <CartSidebar />
    </div>
  );
}
