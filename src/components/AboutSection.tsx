import React from 'react';
import { RestaurantInfo } from '../types/burger';
import { Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  info: RestaurantInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ info }) => {
  return (
    <section id="about" className="py-20 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src={info.aboutImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'}
                alt="À propos de Burger & Co"
                className="w-full h-96 sm:h-[450px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-amber-400/30">
                <p className="text-amber-400 font-black text-sm uppercase tracking-wider">
                  Engagement Qualité Burger & Co
                </p>
                <p className="text-zinc-300 text-xs mt-1">
                  100% bœuf frais, buns dorés au beurre et assaisonnements maison préparés chaque matin.
                </p>
              </div>
            </div>

            {/* Badge flottant */}
            <div className="hidden sm:flex absolute -top-5 -right-5 bg-amber-400 text-black font-black p-4 rounded-2xl shadow-xl flex-col items-center justify-center">
              <Sparkles className="w-6 h-6 mb-1" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Qualité</span>
              <span className="text-lg font-black">Premium</span>
            </div>
          </div>

          {/* Textes & Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <Award className="w-4 h-4" />
              <span>Notre Passion & Savoir-faire</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Une Histoire de Goût et de Générosité
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              {info.aboutText}
            </p>

            {/* Valeurs piliers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Fraîcheur Absolue</h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Aucun compromis. Les légumes sont découpés au fil du service et la viande est hachée purement.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Passion & Convivialité</h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Une équipe chaleureuse et attentionnée pour vous faire passer un moment gourmand inoubliable.
                </p>
              </div>
            </div>

            {/* Compteurs / Stats */}
            {info.stats && info.stats.length > 0 && (
              <div className="pt-6 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {info.stats.map((st, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">{st.value}</p>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">{st.label}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
