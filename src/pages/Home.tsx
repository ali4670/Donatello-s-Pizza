import { Link } from 'react-router-dom';
import { ArrowUpRight, Pizza, Flame, Truck, Leaf, Star, ChevronRight, Clock, MapPin } from 'lucide-react';
import { FloatingFoodHero } from '@/components/ui/hero-section-7';
import { ComicText } from '@/components/ui/comic-text';
import { useLang } from '@/context/LangContext';

export default function Home() {
  const { t } = useLang();

  const stats = [
    { value: '50K+', label: t.pizzasServed },
    { value: '4.9', label: t.starRating },
    { value: '12', label: t.radicalYears },
  ];

  const features = [
    { icon: Pizza, title: t.handcraftedDough, desc: t.handcraftedDoughDesc, emoji: '🫓' },
    { icon: Flame, title: t.woodFiredOven, desc: t.woodFiredOvenDesc, emoji: '🔥' },
    { icon: Leaf, title: t.freshIngredients, desc: t.freshIngredientsDesc, emoji: '🌿' },
    { icon: Truck, title: t.fastDelivery, desc: t.fastDeliveryDesc, emoji: '⚡' },
  ];

  const featuredPizzas = [
    { id: 'don-special', name: 'The Don Special', desc: 'Pepperoni, Italian sausage, mushrooms, black olives, mozzarella', price: '$18.99', img: '/Pizza.jpeg', badge: 'Best Seller', spicy: false },
    { id: 'purple-reign', name: 'Purple Reign', desc: 'Grilled eggplant, roasted garlic, ricotta, fresh basil, balsamic glaze', price: '$16.99', img: '/Pizza.jpeg', badge: 'Vegan', spicy: false },
    { id: 'shell-shock', name: 'Shell Shock', desc: 'Spicy sopressata, hot honey, chili flakes, fresh mozzarella', price: '$17.99', img: '/Pizza.jpeg', badge: 'Spicy', spicy: true },
  ];

  const testimonials = [
    { name: 'Alex R.', review: "The Don Special is hands down the best pizza I've ever had. The crust is perfect — crispy outside, chewy inside. I dream about this pizza.", rating: 5 },
    { name: 'Jamie L.', review: "I'm vegan and Donatello's is my go-to. The Purple Reign pizza is incredible. The roasted garlic and balsamic glaze make it next level.", rating: 5 },
    { name: 'Taylor M.', review: 'The Shell Shock is my favorite — the hot honey and spicy sopressata combo is addictive. Delivery is always fast and hot!', rating: 5 },
  ];

  return (
    <div className="overflow-x-hidden perspective-container">
      {/* Hero Section */}
      <FloatingFoodHero
        title={t.heroTitle}
        description={t.heroDesc}
        subtitle={t.heroSub}
        images={[
          { src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png', alt: 'Pizza slice', className: 'w-32 sm:w-40 md:w-56 bottom-8 right-5 sm:right-10 md:bottom-16 md:right-20' },
          { src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png', alt: 'Pizza slice', className: 'w-24 sm:w-32 md:w-44 top-12 left-4 sm:left-10 md:top-20 md:left-16 -rotate-12', desktopOnly: true },
          { src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png', alt: 'Pizza slice', className: 'w-16 sm:w-24 md:w-32 bottom-1/3 left-8 sm:left-20 rotate-12', desktopOnly: true },
          { src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png', alt: 'Tomato slice', className: 'w-8 sm:w-10 top-1/2 right-1/4' },
          { src: 'https://b.zmtcdn.com/data/o2_assets/70b50e1a48a82437bfa2bed925b862701742892555.png', alt: 'Basil leaf', className: 'w-6 sm:w-10 top-1/3 left-1/4', desktopOnly: true },
        ]}
      />

      {/* Comic Text CTA */}
      <div className="relative z-10 text-center py-16 px-4">
        <ComicText fontSize={3} className="mb-6">{t.cowabunga}</ComicText>
        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/menu" className="group inline-flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-sm tracking-widest uppercase font-inter transition-all duration-300 rounded-bubble animate-pulse-glow">
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            {t.orderNow}
          </Link>
          <Link to="/menu" className="inline-flex items-center gap-2 text-amethyst-mauve/70 hover:text-amethyst-mauve text-sm tracking-widest uppercase font-inter transition-colors duration-300">
            {t.exploreMenu}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 animate-fade-up-delay-4 flex flex-wrap justify-center gap-8 sm:gap-12 px-4 mb-20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center glass rounded-bubble-lg px-8 py-6 card-3d">
            <div className="font-inter text-white text-4xl sm:text-5xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-amethyst-lavender/50 text-[10px] sm:text-xs tracking-widest uppercase mt-2 font-inter">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.whyDifferent}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mt-3">
              {t.radicalPizza}<br /><span className="text-amethyst-mauve">{t.radicalProcess}</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="relative glass rounded-bubble-lg p-4 sm:p-6 text-center card-3d group overflow-hidden">
                <span className="absolute -top-2 -right-2 text-4xl opacity-10 animate-float-3d pointer-events-none" style={{ animationDelay: `${i * 400}ms` }}>{f.emoji}</span>
                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amethyst-royal/20 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-amethyst-royal/40 group-hover:scale-110 transition-all duration-300">
                    <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amethyst-lavender" />
                  </div>
                  <h3 className="font-podium text-white text-xs sm:text-base uppercase tracking-tight">{f.title}</h3>
                  <p className="text-amethyst-mauve/50 text-[11px] sm:text-sm font-inter mt-1 sm:mt-2 leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-10 left-10 text-5xl opacity-10 animate-float-3d-slow pointer-events-none hidden lg:block">🍕</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-10 animate-drift pointer-events-none hidden lg:block">🧀</div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.fanFavorites}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mt-3">{t.mostWanted}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {featuredPizzas.map((pizza, i) => (
              <div key={pizza.id} className="glass-bright rounded-bubble-xl overflow-hidden card-3d group">
                <div className="relative aspect-[4/3] bg-amethyst-ink/30 overflow-hidden">
                  <img src={pizza.img} alt={pizza.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amethyst-dark/60 to-transparent" />
                  {pizza.badge && <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-amethyst-royal text-white text-[8px] sm:text-xs tracking-widest uppercase font-inter px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-amethyst-royal/30">{pizza.badge}</span>}
                  {pizza.spicy && <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-600/80 text-white text-[8px] sm:text-xs tracking-widest uppercase font-inter px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full">🔥 Spicy</span>}
                  <div className="absolute bottom-2 right-2 text-3xl animate-float-3d-fast opacity-30 pointer-events-none" style={{ animationDelay: `${i * 500}ms` }}>🍕</div>
                </div>
                <div className="p-3 sm:p-6">
                  <h3 className="font-podium text-white text-sm sm:text-xl uppercase tracking-tight truncate">{pizza.name}</h3>
                  <p className="text-amethyst-mauve/50 text-xs sm:text-sm font-inter mt-1 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">{pizza.desc}</p>
                  <div className="flex items-center justify-between mt-2 sm:mt-5 pt-2 sm:pt-4 border-t border-amethyst-royal/10">
                    <span className="text-amethyst-lavender font-inter text-sm sm:text-xl font-bold">{pizza.price}</span>
                    <Link to="/menu" className="text-amethyst-mauve/40 text-[10px] sm:text-sm font-inter tracking-wider uppercase group-hover:text-amethyst-lavender transition-colors flex items-center gap-1">
                      {t.addToOrder}
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="inline-flex items-center gap-2 border border-amethyst-royal/30 hover:border-amethyst-lavender text-amethyst-mauve/70 hover:text-amethyst-mauve px-6 py-3 text-sm tracking-widest uppercase font-inter rounded-bubble transition-all duration-300 hover:bg-amethyst-royal/10">
              {t.viewFullMenu}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-16 right-20 text-4xl opacity-10 animate-drift-slow pointer-events-none hidden lg:block">⭐</div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.whatFansSay}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mt-3">{t.radicalReviews}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="glass rounded-bubble-xl p-4 sm:p-6 card-3d-reverse">
                <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3 h-3 sm:w-4 sm:h-4 ${j < testimonial.rating ? 'text-amethyst-lavender' : 'text-amethyst-royal/30'}`} fill={j < testimonial.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="text-amethyst-mauve/60 text-[11px] sm:text-sm font-inter leading-relaxed mb-3 sm:mb-5 line-clamp-3 sm:line-clamp-none">&ldquo;{testimonial.review}&rdquo;</p>
                <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-amethyst-royal/10">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-amethyst-royal/20 flex items-center justify-center text-amethyst-lavender font-inter font-bold text-[10px] sm:text-sm">{testimonial.name.charAt(0)}</div>
                  <p className="text-white font-inter text-xs sm:text-sm font-semibold">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-y border-amethyst-royal/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div className="flex items-center gap-3 text-amethyst-mauve/60">
            <Clock className="w-5 h-5 text-amethyst-lavender animate-wobble" />
            <span className="font-inter text-sm">{t.openDaily}</span>
          </div>
          <div className="flex items-center gap-3 text-amethyst-mauve/60">
            <MapPin className="w-5 h-5 text-amethyst-lavender animate-float" />
            <span className="font-inter text-sm">{t.threeLocations}</span>
          </div>
          <div className="flex items-center gap-3 text-amethyst-mauve/60">
            <Truck className="w-5 h-5 text-amethyst-lavender animate-drift" />
            <span className="font-inter text-sm">{t.freeDeliveryOver}</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass-bright rounded-bubble-xl py-16 px-6 sm:px-12 relative overflow-hidden card-3d">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amethyst-royal/10 rounded-full blur-3xl animate-drift" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amethyst-velvet/10 rounded-full blur-3xl animate-drift-slow" />
          <div className="absolute top-4 left-6 text-2xl opacity-15 animate-float-3d pointer-events-none">🍕</div>
          <div className="absolute bottom-4 right-6 text-2xl opacity-15 animate-float-3d-fast pointer-events-none">🍕</div>
          <div className="relative z-10">
            <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight">{t.readyForBest}</h2>
            <p className="text-amethyst-mauve/50 font-inter text-base mt-4 max-w-2xl mx-auto leading-relaxed">{t.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/menu" className="inline-flex items-center gap-2 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-sm tracking-widest uppercase font-inter rounded-bubble transition-all duration-300 animate-pulse-glow">
                {t.orderNow}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="/locations" className="inline-flex items-center gap-2 border border-amethyst-royal/30 hover:border-amethyst-lavender text-amethyst-mauve/70 hover:text-amethyst-mauve px-8 py-4 text-sm tracking-widest uppercase font-inter rounded-bubble transition-all duration-300">
                {t.findLocation}
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
