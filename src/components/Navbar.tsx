import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ShoppingCart, X, Globe, Home, UtensilsCrossed, MenuIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { t, toggleLang, lang } = useLang();
  const location = useLocation();

  const navLinks = [
    { label: t.ourStory, to: '/story' },
    { label: t.locations, to: '/locations' },
    { label: t.contact, to: '/contact' },
  ];

  const bottomTabs = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: UtensilsCrossed, label: t.menu, to: '/menu' },
    { icon: MenuIcon, label: 'More', to: null },
  ];

  return (
    <>
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7 shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/pizza-logo.jpeg"
            alt="Donatello's Pizza"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amethyst-royal/50"
          />
          <span className="font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider">
            Donatello's
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: t.menu, to: '/menu' },
            ...navLinks,
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-inter text-sm tracking-widest uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? 'text-amethyst-mauve'
                  : 'text-amethyst-mauve/70 hover:text-amethyst-mauve'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="p-3 text-amethyst-mauve/70 hover:text-amethyst-mauve transition-colors duration-300"
            title={lang === 'en' ? 'العربية' : 'English'}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px] font-inter font-bold ml-1">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <Link
            to="/order"
            className={`relative p-3 transition-colors duration-300 ${
              location.pathname === '/order'
                ? 'text-amethyst-mauve'
                : 'text-amethyst-mauve/70 hover:text-amethyst-mauve'
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amethyst-royal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 border border-amethyst-royal/50 hover:border-amethyst-lavender px-6 py-3 text-xs tracking-widest uppercase font-inter text-white hover:bg-amethyst-royal/15 transition-all duration-300 rounded-bubble"
          >
            {t.orderNow}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Right Section - only lang toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="p-2 text-amethyst-mauve/70 hover:text-amethyst-mauve transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[9px] font-inter font-bold ml-0.5">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Page Links */}
      <div className="flex md:hidden overflow-x-auto gap-1 px-4 pb-3 -mt-2 scrollbar-hide">
        {[
          { label: t.menu, to: '/menu' },
          ...navLinks,
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`shrink-0 px-4 py-1.5 text-[10px] tracking-widest uppercase font-inter rounded-full border transition-all duration-300 ${
              location.pathname === link.to
                ? 'bg-amethyst-royal text-white border-amethyst-royal'
                : 'border-amethyst-royal/30 text-amethyst-mauve/60 hover:border-amethyst-royal/60 hover:text-amethyst-mauve'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-amethyst-dark/95 backdrop-blur-xl border-t border-amethyst-royal/15">
        <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {bottomTabs.map((tab) => {
            if (tab.to === null) {
              // "More" button opens menu
              return (
                <button
                  key="more"
                  onClick={() => setMenuOpen(true)}
                  className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors text-amethyst-mauve/50 hover:text-amethyst-mauve"
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[10px] font-inter font-medium">{tab.label}</span>
                </button>
              );
            }
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
                  active
                    ? 'text-amethyst-mauve'
                    : 'text-amethyst-mauve/50 hover:text-amethyst-mauve'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-inter font-medium">{tab.label}</span>
                {tab.to === '/order' && totalItems > 0 && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 bg-amethyst-royal text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile "More" Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-amethyst-dark/98 backdrop-blur-md transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <img
              src="/pizza-logo.jpeg"
              alt="Donatello's Pizza"
              className="w-10 h-10 rounded-full object-cover border-2 border-amethyst-royal/50"
            />
            <span className="font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider">
              Donatello's
            </span>
          </Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="w-7 h-7 text-amethyst-mauve" />
          </button>
        </nav>

        <div className="flex flex-col items-center justify-center h-full -mt-16">
          {[
            { label: t.menu, to: '/menu' },
            ...navLinks,
          ].map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl sm:text-5xl text-white uppercase py-3 transition-all duration-500 hover:text-amethyst-mauve"
              style={{
                transitionDelay: menuOpen ? `${i * 80 + 100}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/order"
            onClick={() => setMenuOpen(false)}
            className="mt-4 font-podium text-4xl sm:text-5xl text-white uppercase py-3 transition-all duration-500 hover:text-amethyst-mauve flex items-center gap-3"
            style={{
              transitionDelay: menuOpen ? `${(navLinks.length + 1) * 80 + 100}ms` : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {t.yourOrder}
            {totalItems > 0 && (
              <span className="w-7 h-7 bg-amethyst-royal text-white text-xs font-bold rounded-full flex items-center justify-center font-inter">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/menu"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex items-center gap-2 border border-amethyst-royal/50 px-6 py-3 text-xs tracking-widest uppercase font-inter text-white transition-all duration-500 rounded-bubble hover:bg-amethyst-royal/15"
            style={{
              transitionDelay: menuOpen ? `${(navLinks.length + 2) * 80 + 100}ms` : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {t.orderNow}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
