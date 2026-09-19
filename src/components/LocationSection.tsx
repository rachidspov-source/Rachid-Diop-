import React from 'react';
import { RestaurantInfo } from '../types/burger';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  info: RestaurantInfo;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ info }) => {
  return (
    <section id="location" className="py-20 bg-zinc-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <MapPin className="w-4 h-4" />
            <span>Emplacement & Accès</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Nous Trouver
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Venez déguster vos burgers chauds et croustillants dans un cadre chaleureux et convivial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Fiche Infos & Horaires */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Adresse & Téléphone */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Adresse du restaurant</h3>
                  <p className="text-zinc-300 text-sm mt-1 leading-relaxed">
                    {info.address}
                  </p>
                  <p className="text-amber-400 font-bold text-sm mt-0.5">
                    {info.city}, {info.country}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Téléphone</h3>
                  <a 
                    href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-zinc-300 hover:text-amber-400 text-sm font-semibold transition mt-1 block"
                  >
                    {info.phone}
                  </a>
                </div>
              </div>

              {/* Bouton Itinéraire */}
              <div className="pt-2">
                <a
                  href={info.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-location-directions"
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black py-3.5 px-6 rounded-xl transition shadow-lg shadow-amber-400/10 hover:shadow-amber-400/30 text-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Obtenir l'itinéraire sur Google Maps</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Horaires d'ouverture</h3>
              </div>

              <div className="divide-y divide-zinc-800 text-sm">
                {info.openingHours.map((schedule, i) => (
                  <div key={i} className="py-2.5 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium">{schedule.days}</span>
                    <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20 text-xs">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Carte Google Maps Responsive Intégrée */}
          <div className="lg:col-span-7 h-[420px] lg:h-[530px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-950">
            {info.googleMapsEmbed ? (
              <iframe
                title="Localisation Burger & Co"
                src={info.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                <p className="text-lg font-bold text-white">Carte Google Maps</p>
                <p className="text-zinc-400 text-sm mt-1">{info.address}, {info.city}</p>
                <a
                  href={info.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2.5 bg-amber-400 text-black font-black rounded-xl text-sm"
                >
                  Ouvrir Google Maps
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
