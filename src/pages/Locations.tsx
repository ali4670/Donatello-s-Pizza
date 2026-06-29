import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const locations = [
  { name: 'Downtown', address: '123 Radical Ave, Turtle District', phone: '(555) 123-4567', hours: 'Mon-Sun 11AM - 11PM', features: ['dineIn', 'takeout', 'delivery', 'outdoorSeating'] },
  { name: 'Midtown', address: '456 Shell Street, Pizza Quarter', phone: '(555) 234-5678', hours: 'Mon-Sun 11AM - 10PM', features: ['dineIn', 'takeout', 'delivery'] },
  { name: 'Uptown', address: '789 Bubble Boulevard, Artisan Row', phone: '(555) 345-6789', hours: 'Mon-Sun 12PM - 11PM', features: ['dineIn', 'takeout', 'privateEvents'] },
];

export default function Locations() {
  const { t } = useLang();

  const getFeatureLabel = (key: string) => {
    const map: Record<string, string> = {
      dineIn: t.dineIn,
      takeout: t.takeout,
      delivery: t.delivery,
      outdoorSeating: t.outdoorSeating,
      privateEvents: t.privateEvents,
    };
    return map[key] || key;
  };

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16">
      {/* Hero Image */}
      <div className="max-w-6xl mx-auto mb-16 rounded-bubble-xl overflow-hidden border border-amethyst-royal/15">
        <img src="/our-location.png" alt="Our Locations" className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover" />
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.findYourSlice}</span>
        <h1 className="font-podium text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight mt-3">{t.locationsTitle}</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-4 max-w-lg mx-auto">{t.locationsIntro}</p>
      </div>

      {/* Location Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
        {locations.map((loc) => (
          <div key={loc.name} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-xl overflow-hidden hover:border-amethyst-royal/40 transition-all duration-300 group">
            <div className="aspect-[16/9] bg-amethyst-ink/30 flex items-center justify-center">
              <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-amethyst-royal/30" />
            </div>
            <div className="p-3 sm:p-6">
              <h2 className="font-podium text-white text-sm sm:text-2xl uppercase tracking-tight">{loc.name}</h2>
              <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-3">
                <div className="flex items-start gap-1.5 sm:gap-3"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 mt-0.5 shrink-0" /><span className="text-amethyst-mauve/60 text-[10px] sm:text-sm font-inter">{loc.address}</span></div>
                <div className="flex items-center gap-1.5 sm:gap-3"><Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 shrink-0" /><a href={`tel:${loc.phone.replace(/[^\d]/g, '')}`} className="text-amethyst-mauve/60 text-[10px] sm:text-sm font-inter hover:text-amethyst-mauve transition-colors">{loc.phone}</a></div>
                <div className="flex items-center gap-1.5 sm:gap-3"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 shrink-0" /><span className="text-amethyst-mauve/60 text-[10px] sm:text-sm font-inter">{loc.hours}</span></div>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-5">
                {loc.features.map((f) => (
                  <span key={f} className="text-[8px] sm:text-[10px] tracking-wider uppercase font-inter text-amethyst-lavender/60 border border-amethyst-royal/20 rounded-full px-2 py-0.5 sm:px-3 sm:py-1">{getFeatureLabel(f)}</span>
                ))}
              </div>
              <Link to="/menu" className="mt-3 sm:mt-6 w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-amethyst-royal/20 hover:bg-amethyst-royal/40 text-amethyst-lavender py-2 sm:py-3 text-[10px] sm:text-xs tracking-widest uppercase font-inter rounded-bubble transition-all duration-300 border border-amethyst-royal/20">
                {t.orderFrom} {loc.name}<ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
