import React, { useState } from 'react';
import { HeroSettings, RestaurantInfo } from '../../types/burger';
import { ImageUploader } from './ImageUploader';
import { Check, Sparkles } from 'lucide-react';

interface ContentEditorProps {
  hero: HeroSettings;
  info: RestaurantInfo;
  onUpdateHero: (hero: HeroSettings) => void;
  onUpdateInfo: (info: RestaurantInfo) => void;
  section: 'hero' | 'about' | 'instagram' | 'location' | 'contact' | 'settings';
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  hero,
  info,
  onUpdateHero,
  onUpdateInfo,
  section
}) => {
  const [localHero, setLocalHero] = useState<HeroSettings>({ ...hero });
  const [localInfo, setLocalInfo] = useState<RestaurantInfo>({ ...info });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHero(localHero);
    onUpdateInfo(localInfo);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleHoursChange = (index: number, field: 'days' | 'hours', val: string) => {
    const updated = [...localInfo.openingHours];
    updated[index] = { ...updated[index], [field]: val };
    setLocalInfo({ ...localInfo, openingHours: updated });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
      
      {savedMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-bold animate-pulse">
          <Check className="w-4 h-4" />
          <span>Modifications enregistrées avec succès et visibles immédiatement sur le site !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION HERO */}
        {section === 'hero' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Section d'Accueil (Hero)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Titre Principal (Nom de marque)</label>
                <input
                  type="text"
                  value={localHero.title}
                  onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Slogan Accrocheur (ex: Le goût qui fait la différence)</label>
                <input
                  type="text"
                  value={localHero.subtitle}
                  onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Badge en haut de l'accueil</label>
              <input
                type="text"
                value={localHero.badgeText}
                onChange={(e) => setLocalHero({ ...localHero, badgeText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Texte Bouton 1 (ex: Voir le menu)</label>
                <input
                  type="text"
                  value={localHero.ctaPrimaryText}
                  onChange={(e) => setLocalHero({ ...localHero, ctaPrimaryText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Texte Bouton 2 (ex: Nous contacter)</label>
                <input
                  type="text"
                  value={localHero.ctaSecondaryText}
                  onChange={(e) => setLocalHero({ ...localHero, ctaSecondaryText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <ImageUploader
              label="Grande photo de burger d'arrière-plan / Hero"
              currentUrl={localHero.heroImage}
              onImageUploaded={(url) => setLocalHero({ ...localHero, heroImage: url })}
              folder="hero"
            />
          </div>
        )}

        {/* SECTION À PROPOS */}
        {section === 'about' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Section À Propos & Savoir-faire
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Texte de présentation de la marque</label>
              <textarea
                rows={4}
                value={localInfo.aboutText}
                onChange={(e) => setLocalInfo({ ...localInfo, aboutText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <ImageUploader
              label="Photo de la section À Propos"
              currentUrl={localInfo.aboutImage}
              onImageUploaded={(url) => setLocalInfo({ ...localInfo, aboutImage: url })}
              folder="about"
            />
          </div>
        )}

        {/* SECTION INSTAGRAM */}
        {section === 'instagram' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Configuration Instagram
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Identifiant Instagram affiché</label>
                <input
                  type="text"
                  value={localInfo.instagramHandle}
                  onChange={(e) => setLocalInfo({ ...localInfo, instagramHandle: e.target.value })}
                  placeholder="@burger_and_co_sn"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Lien URL vers le profil Instagram</label>
                <input
                  type="url"
                  value={localInfo.instagramUrl}
                  onChange={(e) => setLocalInfo({ ...localInfo, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/burger_and_co_sn"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION LOCALISATION */}
        {section === 'location' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Localisation & Horaires d'ouverture
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Adresse physique</label>
                <input
                  type="text"
                  value={localInfo.address}
                  onChange={(e) => setLocalInfo({ ...localInfo, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Ville</label>
                <input
                  type="text"
                  value={localInfo.city}
                  onChange={(e) => setLocalInfo({ ...localInfo, city: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Lien d'itinéraire Google Maps</label>
              <input
                type="url"
                value={localInfo.googleMapsUrl}
                onChange={(e) => setLocalInfo({ ...localInfo, googleMapsUrl: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">URL d'intégration Google Maps (iframe src)</label>
              <input
                type="text"
                value={localInfo.googleMapsEmbed}
                onChange={(e) => setLocalInfo({ ...localInfo, googleMapsEmbed: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2">Horaires d'ouverture</label>
              <div className="space-y-2">
                {localInfo.openingHours.map((h, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={h.days}
                      onChange={(e) => handleHoursChange(i, 'days', e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={h.hours}
                      onChange={(e) => handleHoursChange(i, 'hours', e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION CONTACT */}
        {section === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Coordonnées & Numéro WhatsApp
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Numéro WhatsApp (commandes)</label>
                <input
                  type="text"
                  value={localInfo.whatsappNumber}
                  onChange={(e) => setLocalInfo({ ...localInfo, whatsappNumber: e.target.value })}
                  placeholder="+221 77 000 00 00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Téléphone direct appel</label>
                <input
                  type="text"
                  value={localInfo.phone}
                  onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
                  placeholder="+221 33 000 00 00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Email restaurant</label>
                <input
                  type="email"
                  value={localInfo.email}
                  onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Message d'accueil WhatsApp par défaut</label>
                <input
                  type="text"
                  value={localInfo.whatsappMessage}
                  onChange={(e) => setLocalInfo({ ...localInfo, whatsappMessage: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION PARAMÈTRES / LOGO */}
        {section === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2">
              Paramètres Généraux & Logo Officiel
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Nom Officiel de l'Établissement</label>
              <input
                type="text"
                value={localInfo.name}
                onChange={(e) => setLocalInfo({ ...localInfo, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <ImageUploader
              label="Logo officiel Burger & Co (PNG transparent recommandé)"
              currentUrl={localInfo.logoUrl}
              onImageUploaded={(url) => setLocalInfo({ ...localInfo, logoUrl: url })}
              folder="logo"
            />
          </div>
        )}

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded-xl shadow-lg shadow-amber-400/20 transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>

      </form>
    </div>
  );
};
