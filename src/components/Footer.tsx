import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function Footer() {
  const { t } = useLang();

  const footerLinks = [
    {
      heading: t.explore,
      links: [
        { label: t.ourMenu, to: '/menu' },
        { label: t.ourStory, to: '/story' },
        { label: t.locations, to: '/locations' },
        { label: t.giftCards, to: '/menu' },
      ],
    },
    {
      heading: t.company,
      links: [
        { label: t.aboutUs, to: '/story' },
        { label: t.careers, to: '/contact' },
        { label: t.press, to: '/story' },
        { label: t.contact, to: '/contact' },
      ],
    },
  ];

  return (
    <footer className="shrink-0 border-t border-amethyst-royal/20 bg-amethyst-dark/80 backdrop-blur-sm">
      <div className="px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:max-w-xs">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/pizza-logo.jpeg"
                alt="Donatello's Pizza"
                className="w-10 h-10 rounded-full object-cover border-2 border-amethyst-royal/50"
              />
              <span className="font-podium text-white font-bold uppercase text-xl tracking-wider">
                Donatello's
              </span>
            </Link>
            <p className="text-amethyst-mauve/50 text-sm font-inter leading-relaxed">
              {t.tagline}
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.facebook.com/share/1BU8sxb9Ft/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-amethyst-royal/30 flex items-center justify-center text-amethyst-mauve/60 hover:text-amethyst-mauve hover:border-amethyst-royal/60 transition-all duration-300 text-xs font-bold">f</a>
              <a href="#" className="w-9 h-9 rounded-full border border-amethyst-royal/30 flex items-center justify-center text-amethyst-mauve/60 hover:text-amethyst-mauve hover:border-amethyst-royal/60 transition-all duration-300 text-xs font-bold">in</a>
              <a href="#" className="w-9 h-9 rounded-full border border-amethyst-royal/30 flex items-center justify-center text-amethyst-mauve/60 hover:text-amethyst-mauve hover:border-amethyst-royal/60 transition-all duration-300 text-xs font-bold">tk</a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <h4 className="font-inter text-amethyst-lavender text-xs tracking-widest uppercase mb-4 font-semibold">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="font-inter text-amethyst-mauve/50 text-sm hover:text-amethyst-mauve transition-colors duration-300">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:max-w-xs">
            <h4 className="font-inter text-amethyst-lavender text-xs tracking-widest uppercase mb-4 font-semibold">{t.stayRadical}</h4>
            <p className="text-amethyst-mauve/50 text-sm font-inter mb-4">{t.newsletterDesc}</p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" className="flex-1 bg-amethyst-dark-2/60 border border-amethyst-royal/30 rounded-bubble px-4 py-2.5 text-sm text-white placeholder-amethyst-mauve/30 font-inter focus:outline-none focus:border-amethyst-lavender transition-colors" />
              <button className="bg-amethyst-royal hover:bg-amethyst-velvet text-white px-5 py-2.5 text-xs tracking-widest uppercase font-inter rounded-bubble transition-colors duration-300">{t.join}</button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-amethyst-royal/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-amethyst-mauve/30 text-xs font-inter">{t.copyright}</p>
          <p className="text-amethyst-mauve/30 text-xs font-inter">{t.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
