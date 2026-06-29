import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, Heart, Users, Utensils } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function Story() {
  const { t } = useLang();

  const values = [
    { icon: Flame, title: t.boldFlavors, desc: t.boldFlavorsDesc },
    { icon: Heart, title: t.madeWithLove, desc: t.madeWithLoveDesc },
    { icon: Users, title: t.communityFirst, desc: t.communityFirstDesc },
    { icon: Utensils, title: t.freshIngredientsVal, desc: t.freshIngredientsValDesc },
  ];

  const timeline = [
    { year: '2014', title: 'The Beginning', desc: 'Started with a single oven, a secret recipe, and a dream to make the most radical pizza in town.' },
    { year: '2016', title: 'First Fan Favorite', desc: 'The Don Special became an overnight sensation. Lines out the door every weekend.' },
    { year: '2019', title: 'Going Viral', desc: 'Our Purple Reign pizza hit 2M views on social media. The world took notice.' },
    { year: '2022', title: 'Expanding the Dream', desc: 'Opened two more locations while keeping the same handmade quality.' },
    { year: '2026', title: 'Still Growing', desc: '50,000+ pizzas served and counting. The best is yet to come.' },
  ];

  return (
    <div className="py-12 lg:py-20">
      {/* Hero Image */}
      <section className="px-6 sm:px-10 lg:px-16 mb-20">
        <div className="max-w-4xl mx-auto rounded-bubble-xl overflow-hidden border border-amethyst-royal/20">
          <img src="/our-story.png" alt="Our Story" className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover" />
        </div>
      </section>

      {/* Hero Banner */}
      <section className="px-6 sm:px-10 lg:px-16 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.ourStory}</span>
          <h1 className="font-podium text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight mt-3">
            {t.bornFromPassion}<br /><span className="text-amethyst-mauve">{t.fueledByFlavor}</span>
          </h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm sm:text-base mt-6 max-w-2xl mx-auto leading-relaxed">{t.storyIntro}</p>
        </div>
      </section>

      {/* Image + Text */}
      <section className="px-6 sm:px-10 lg:px-16 mb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] rounded-bubble-xl overflow-hidden border border-amethyst-royal/20">
            <img src="/pizza-logo.jpeg" alt="Donatello's Kitchen" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.theOrigin}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight mt-3">{t.kitchenDream}</h2>
            <p className="text-amethyst-mauve/50 font-inter text-sm leading-relaxed mt-4">{t.storyP1}</p>
            <p className="text-amethyst-mauve/50 font-inter text-sm leading-relaxed mt-3">{t.storyP2}</p>
            <Link to="/menu" className="inline-flex items-center gap-2 mt-6 text-amethyst-lavender text-sm font-inter tracking-wider uppercase hover:text-amethyst-mauve transition-colors">
              {t.tasteDifference}<ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 sm:px-10 lg:px-16 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.whatDrivesUs}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight mt-3">{t.ourValues}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg p-4 sm:p-6 text-center hover:border-amethyst-royal/40 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amethyst-royal/20 flex items-center justify-center mx-auto mb-2 sm:mb-4"><v.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amethyst-lavender" /></div>
                <h3 className="font-podium text-white text-[11px] sm:text-sm uppercase tracking-tight">{v.title}</h3>
                <p className="text-amethyst-mauve/50 text-[11px] sm:text-sm font-inter mt-1 sm:mt-2 leading-relaxed hidden sm:block">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 sm:px-10 lg:px-16 mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.theJourney}</span>
            <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight mt-3">{t.howWeGotHere}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-amethyst-royal/20" />
            <div className="space-y-10">
              {timeline.map((item) => (
                <div key={item.year} className="relative pl-12 sm:pl-16">
                  <div className="absolute left-2.5 sm:left-4.5 top-1 w-3 h-3 rounded-full bg-amethyst-royal border-2 border-amethyst-dark" />
                  <span className="text-amethyst-lavender font-inter text-xs tracking-widest uppercase">{item.year}</span>
                  <h3 className="font-podium text-white text-lg uppercase tracking-tight mt-1">{item.title}</h3>
                  <p className="text-amethyst-mauve/50 text-sm font-inter mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="max-w-4xl mx-auto text-center bg-amethyst-dark-2/40 border border-amethyst-royal/20 rounded-bubble-xl py-14 px-6">
          <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight">{t.readyToTaste}</h2>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-4 max-w-md mx-auto">{t.readyToTasteDesc}</p>
          <Link to="/menu" className="inline-flex items-center gap-2 mt-8 bg-amethyst-royal hover:bg-amethyst-velvet text-white px-8 py-4 text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300 animate-pulse-glow">
            {t.orderNow}<ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
