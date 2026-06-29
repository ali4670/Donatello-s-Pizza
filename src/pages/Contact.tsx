import { Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const socials = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/1BU8sxb9Ft/', handle: '@donatellos.pizza', icon: 'f' },
  { name: 'Instagram', url: '#', handle: '@donatellos.pizza', icon: 'in' },
  { name: 'TikTok', url: '#', handle: '@donatellos.pizza', icon: 'tk' },
  { name: 'Twitter / X', url: '#', handle: '@donatellos_pizza', icon: 'X' },
];

const locations = [
  { name: 'Downtown', address: '123 Radical Ave, Turtle District', phone: '(555) 123-4567', hours: 'Mon-Sun 11AM - 11PM' },
  { name: 'Midtown', address: '456 Shell Street, Pizza Quarter', phone: '(555) 234-5678', hours: 'Mon-Sun 11AM - 10PM' },
  { name: 'Uptown', address: '789 Bubble Boulevard, Artisan Row', phone: '(555) 345-6789', hours: 'Mon-Sun 12PM - 11PM' },
];

export default function Contact() {
  const { t } = useLang();

  return (
    <div className="py-12 lg:py-20 px-6 sm:px-10 lg:px-16">
      {/* Hero Image */}
      <div className="max-w-6xl mx-auto mb-16 rounded-bubble-xl overflow-hidden border border-amethyst-royal/15">
        <img src="/Socai.png" alt="Social" className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover" />
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.getInTouch}</span>
        <h1 className="font-podium text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight mt-3">{t.contactTitle}</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-4 max-w-lg mx-auto">{t.contactIntro}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg p-8">
          <h2 className="font-podium text-white text-xl uppercase tracking-tight mb-6">{t.sendMessage}</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter tracking-wider uppercase mb-1.5 block">{t.name}</label>
                <input type="text" placeholder={t.yourName} className="w-full bg-amethyst-dark/60 border border-amethyst-royal/30 rounded-bubble px-4 py-3 text-sm text-white placeholder-amethyst-mauve/30 font-inter focus:outline-none focus:border-amethyst-lavender transition-colors" />
              </div>
              <div>
                <label className="text-amethyst-mauve/60 text-xs font-inter tracking-wider uppercase mb-1.5 block">{t.email}</label>
                <input type="email" placeholder="your@email.com" className="w-full bg-amethyst-dark/60 border border-amethyst-royal/30 rounded-bubble px-4 py-3 text-sm text-white placeholder-amethyst-mauve/30 font-inter focus:outline-none focus:border-amethyst-lavender transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-amethyst-mauve/60 text-xs font-inter tracking-wider uppercase mb-1.5 block">{t.subject}</label>
              <select className="w-full bg-amethyst-dark/60 border border-amethyst-royal/30 rounded-bubble px-4 py-3 text-sm text-amethyst-mauve/50 font-inter focus:outline-none focus:border-amethyst-lavender transition-colors appearance-none">
                <option>General Inquiry</option>
                <option>Catering Request</option>
                <option>Feedback</option>
                <option>Partnership</option>
                <option>Careers</option>
              </select>
            </div>
            <div>
              <label className="text-amethyst-mauve/60 text-xs font-inter tracking-wider uppercase mb-1.5 block">{t.message}</label>
              <textarea rows={5} placeholder={t.messagePlaceholder} className="w-full bg-amethyst-dark/60 border border-amethyst-royal/30 rounded-bubble px-4 py-3 text-sm text-white placeholder-amethyst-mauve/30 font-inter focus:outline-none focus:border-amethyst-lavender transition-colors resize-none" />
            </div>
            <button className="w-full bg-amethyst-royal hover:bg-amethyst-velvet text-white py-3.5 text-xs tracking-widest uppercase font-inter rounded-bubble transition-colors duration-300">{t.send}</button>
          </form>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg p-8">
            <h2 className="font-podium text-white text-xl uppercase tracking-tight mb-6">{t.quickContact}</h2>
            <div className="space-y-4">
              <a href="mailto:hello@donatellos.pizza" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-amethyst-royal/20 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-amethyst-lavender" /></div>
                <div><p className="text-amethyst-mauve/40 text-xs font-inter uppercase tracking-wider">{t.email}</p><p className="text-white text-sm font-inter group-hover:text-amethyst-mauve transition-colors">hello@donatellos.pizza</p></div>
              </a>
              <a href="tel:5551234567" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-amethyst-royal/20 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-amethyst-lavender" /></div>
                <div><p className="text-amethyst-mauve/40 text-xs font-inter uppercase tracking-wider">{t.phoneNumber?.replace(' *', '')}</p><p className="text-white text-sm font-inter group-hover:text-amethyst-mauve transition-colors">(555) 123-4567</p></div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amethyst-royal/20 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-amethyst-lavender" /></div>
                <div><p className="text-amethyst-mauve/40 text-xs font-inter uppercase tracking-wider">{t.deliveryAddress?.replace(' *', '')}</p><p className="text-white text-sm font-inter">123 Radical Ave, Turtle District</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amethyst-royal/20 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-amethyst-lavender" /></div>
                <div><p className="text-amethyst-mauve/40 text-xs font-inter uppercase tracking-wider">{t.deliveryTime}</p><p className="text-white text-sm font-inter">{t.openDaily}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg p-8">
            <h2 className="font-podium text-white text-xl uppercase tracking-tight mb-6">{t.followUs}</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 sm:gap-3 bg-amethyst-dark/40 border border-amethyst-royal/15 rounded-bubble p-3 sm:p-4 hover:border-amethyst-royal/40 transition-all duration-300">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amethyst-royal/20 flex items-center justify-center text-amethyst-lavender text-[10px] sm:text-xs font-bold shrink-0">{s.icon}</div>
                  <div className="min-w-0"><p className="text-white text-xs sm:text-sm font-inter font-semibold truncate">{s.name}</p><p className="text-amethyst-mauve/40 text-[10px] sm:text-xs font-inter truncate">{s.handle}</p></div>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amethyst-mauve/30 group-hover:text-amethyst-lavender transition-colors ml-auto shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="text-center mb-10">
          <span className="text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase">{t.findUs}</span>
          <h2 className="font-podium text-white text-3xl sm:text-4xl uppercase tracking-tight mt-3">{t.locationsTitle}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {locations.map((loc) => (
            <div key={loc.name} className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-bubble-lg p-4 sm:p-6 hover:border-amethyst-royal/40 transition-all duration-300">
              <h3 className="font-podium text-white text-sm sm:text-lg uppercase tracking-tight">{loc.name}</h3>
              <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-2.5">
                <div className="flex items-start gap-1.5 sm:gap-2"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 mt-0.5 shrink-0" /><span className="text-amethyst-mauve/50 text-[10px] sm:text-sm font-inter">{loc.address}</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 shrink-0" /><span className="text-amethyst-mauve/50 text-[10px] sm:text-sm font-inter">{loc.phone}</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amethyst-lavender/60 shrink-0" /><span className="text-amethyst-mauve/50 text-[10px] sm:text-sm font-inter">{loc.hours}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
