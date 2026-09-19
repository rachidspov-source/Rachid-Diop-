import React from 'react';
import { RestaurantInfo } from '../types/burger';
import { Instagram, ArrowUpRight, Flame, Heart, MessageCircle } from 'lucide-react';

interface InstagramSectionProps {
  info: RestaurantInfo;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ info }) => {
  return (
    <section id="instagram" className="py-20 bg-zinc-950 text-white relative border-t border-zinc-900 overflow-hidden">
      
      {/* Glow d'ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl p-8 sm:p-14 border border-zinc-800 shadow-2xl text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/10 mb-6 transform hover:rotate-6 transition-transform">
            <Instagram className="w-8 h-8" />
          </div>

          <div className="space-y-2 mb-6">
            <span className="text-amber-400 font-extrabold uppercase tracking-widest text-xs">
              Rejoignez la communauté
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {info.instagramHandle}
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mt-2">
              Suivez nos coulisses, nos lancements de recettes éphémères et nos stories gourmandes en direct chaque jour.
            </p>
          </div>

          {/* Grille illustrative moderne d'Instagram */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            <div className="relative rounded-xl overflow-hidden aspect-square border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                alt="Instagram Burger 1"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Heart className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-square border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80"
                alt="Instagram Burger 2"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Heart className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-square border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80"
                alt="Instagram Burger 3"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Heart className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-square border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80"
                alt="Instagram Burger 4"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Heart className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
            </div>
          </div>

          {/* Bouton CTA Instagram Officiel */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={info.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-follow-instagram"
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-base shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Instagram className="w-5 h-5 text-black" />
              <span>Suivre sur Instagram</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-base border border-zinc-800 transition flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Nous envoyer un message</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
