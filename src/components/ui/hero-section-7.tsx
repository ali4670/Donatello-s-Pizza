import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface FloatingImageProps {
  src: string;
  alt: string;
  className: string;
  desktopOnly?: boolean;
}

export interface FloatingFoodHeroProps {
  title: string;
  description: string;
  subtitle?: string;
  images: FloatingImageProps[];
  className?: string;
  children?: ReactNode;
}

export function FloatingFoodHero({
  title,
  description,
  subtitle,
  images,
  className,
  children,
}: FloatingFoodHeroProps) {
  const mobileImages = images.filter((img) => !img.desktopOnly);

  return (
    <section
      className={cn(
        'relative w-full min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden py-16 md:py-24',
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/PHONE-BG.png"
          alt=""
          className="w-full h-full object-cover sm:hidden"
          aria-hidden="true"
        />
        <img
          src="/BG.png"
          alt=""
          className="w-full h-full object-cover hidden sm:block"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-amethyst-dark/30" />
      </div>

      {/* Floating images */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {mobileImages.map((image, index) => (
          <img
            key={`mobile-${index}`}
            src={image.src}
            alt={image.alt}
            className={cn('absolute object-contain animate-float sm:hidden', image.className)}
            style={{ animationDelay: `${index * 300}ms` }}
          />
        ))}
        {images.map((image, index) => (
          <img
            key={`desktop-${index}`}
            src={image.src}
            alt={image.alt}
            className={cn('absolute object-contain animate-float hidden sm:block', image.className)}
            style={{ animationDelay: `${index * 300}ms` }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amethyst-royal/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amethyst-velvet/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amethyst-royal/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center max-w-3xl">
        <div className="animate-fade-up">
          <span className="inline-block text-amethyst-lavender text-xs font-inter tracking-[0.3em] uppercase mb-4">
            {subtitle || 'Est. 2014 — Radical Pizza'}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-podium text-white uppercase tracking-tight animate-fade-up-delay-1 leading-[1.05]">
          {title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl leading-8 text-amethyst-mauve/80 font-inter animate-fade-up-delay-2 max-w-xl mx-auto">
          {description}
        </p>

        {/* Action Area */}
        {children && (
          <div className="mt-8 animate-fade-up-delay-3">
            {children}
          </div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amethyst-dark to-transparent z-[25]" />
    </section>
  );
}
