import React from 'react';
import { HeroSettings, RestaurantInfo } from '../types/burger';
import { ArrowRight, Flame, Star, Sparkles, MapPin, ChevronDown } from 'lucide-react';

interface HeroProps {
  hero: HeroSettings;
  info: RestaurantInfo;
  onNavigateMenu: () => void;
  onNavigateContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ hero, info, onNavigateMenu, onNavigateContact }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center bg-zinc-950 overflow-hidden text-white pt-6 pb-16">
      {/* Background radial gradient & textures */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-zinc-950/80 to-zinc-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Texte Hero */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            
            {/* Badge promotionnel / accroche */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hero.badgeText || 'Recettes Signatures & Pain Brioché'}</span>
            </div>

            {/* Titre Principal */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-none">
                {hero.title}
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 tracking-tight">
                {hero.subtitle}
              </p>
            </div>

            {/* Description / Slogan */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Des steaks hachés smashés minute croustillants, du véritable cheddar affiné coulant et des sauces artisanales secrètes. Vivez l'expérience burger ultime signée{' '}
              <span className="text-amber-400 font-semibold">{info.instagramHandle}</span>.
            </p>

            {/* Boutons d'action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onNavigateMenu}
                id="btn-hero-view-menu"
                className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-base shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{hero.ctaPrimaryText || 'Voir le menu'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onNavigateContact}
                id="btn-hero-contact"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-base border border-zinc-700/80 hover:border-amber-400/50 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>{hero.ctaSecondaryText || 'Nous contacter & Localisation'}</span>
              </button>
            </div>

            {/* Points forts */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">100%</p>
                <p className="text-xs text-zinc-400 font-medium">Bœuf frais & local</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">Fait maison</p>
                <p className="text-xs text-zinc-400 font-medium">Sauces & frites fraîches</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">7j / 7</p>
                <p className="text-xs text-zinc-400 font-medium">Sur place & à emporter</p>
              </div>
            </div>

          </div>

          {/* Photo Burger Hero Moderne */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Halo lumineux */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-amber-400/20 rounded-full blur-2xl -z-0 animate-pulse" />
            
            <div className="relative z-10 w-full max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30 bg-zinc-900/60 p-2 backdrop-blur-sm transform transition duration-500 hover:scale-[1.02]">
                <img
                  src={hero.heroImage}
                  alt={hero.title}
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover rounded-xl"
                  loading="eager"
                />
                
                {/* Badge flottant sur l'image */}
                <div className="absolute top-6 right-6 bg-black/90 backdrop-blur-md border border-amber-400/40 text-amber-400 py-1.5 px-3 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Smashé à la flamme</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md border border-zinc-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="text-white font-bold">{info.brandTagline}</p>
                    <p className="text-zinc-400">Sur place, à emporter ou livraison</p>
                  </div>
                  <span className="text-amber-400 font-black text-sm">Burger & Co</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
