import React from 'react';
import { RestaurantInfo } from '../types/burger';
import { Instagram, MessageCircle, Phone, Lock, Heart } from 'lucide-react';

interface FooterProps {
  info: RestaurantInfo;
  onNavigate: (id: string) => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ info, onNavigate, onOpenAdminLogin }) => {
  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Identité */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-lg shadow-md shadow-amber-400/20">
                B&C
              </div>
              <span className="text-xl font-black tracking-wider text-white uppercase">
                {info.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {info.brandTagline} Burgers gourmands préparés avec passion, bœuf 100% frais et ingrédients de premier choix.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={info.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 flex items-center justify-center transition border border-zinc-800"
                title="Instagram Burger & Co"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 flex items-center justify-center transition border border-zinc-800"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`}
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 flex items-center justify-center transition border border-zinc-800"
                title="Téléphone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-amber-400 transition">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-400 transition">
                  La Carte des Burgers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition">
                  Notre Savoir-faire
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-amber-400 transition">
                  Galerie Photos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('location')} className="hover:text-amber-400 transition">
                  Trouver le restaurant
                </button>
              </li>
            </ul>
          </div>

          {/* Horaires d'ouverture */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Horaires</h4>
            <div className="space-y-1.5 text-xs">
              {info.openingHours.map((h, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-zinc-500">{h.days}</span>
                  <span className="text-zinc-300 font-medium">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Localisation & Commande */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Adresse & Contact</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {info.address}<br />
              {info.city}, {info.country}
            </p>
            <p className="text-xs text-amber-400 font-bold">
              Tél: {info.phone}
            </p>
            <a
              href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <span>Commander via WhatsApp &rarr;</span>
            </a>
          </div>

        </div>

        {/* Barre inférieure */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} {info.name} — Tous droits réservés.
          </p>

          <div className="flex items-center gap-4">
            <a
              href={info.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400"
            >
              {info.instagramHandle}
            </a>

            <span className="text-zinc-700">|</span>

            <button
              onClick={onOpenAdminLogin}
              id="btn-footer-admin-link"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-amber-400 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Administration</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
