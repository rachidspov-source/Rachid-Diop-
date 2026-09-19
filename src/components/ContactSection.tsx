import React, { useState } from 'react';
import { RestaurantInfo } from '../types/burger';
import { Phone, MessageCircle, Instagram, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  info: RestaurantInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ info }) => {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Créer un message WhatsApp pré-rempli pour envoyer directement
    const fullMsg = `Bonjour Burger & Co, je m'appelle ${name} (tél: ${phone}). ${message}`;
    const url = `https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, '_blank');
    setFormSent(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-20 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Phone className="w-4 h-4" />
            <span>À Votre Écoute</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Contact & Commandes
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Une question, une commande spéciale ou une réservation ? Écrivez-nous ou appelez directement notre équipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bloc canaux directs (WhatsApp, Téléphone, Instagram) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Carte WhatsApp en avant */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Canal Express</span>
                  <h3 className="text-xl font-bold text-white">Commande WhatsApp Rapide</h3>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Le moyen le plus rapide pour commander vos burgers ou demander notre disponibilité en temps réel.
              </p>
              <a
                href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-contact-whatsapp-direct"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Discuter sur WhatsApp ({info.whatsappNumber})</span>
              </a>
            </div>

            {/* Récapitulatif Coordonnées */}
            <div className="bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-4">
              <h4 className="font-bold text-white text-base border-b border-zinc-800 pb-3">
                Coordonnées Directes
              </h4>

              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 font-semibold">Téléphone Restaurant</p>
                  <a href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-400 font-medium">
                    {info.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <Instagram className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 font-semibold">Instagram Officiel</p>
                  <a href={info.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 font-medium">
                    {info.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 font-semibold">Adresse Email</p>
                  <a href={`mailto:${info.email}`} className="hover:text-amber-400 font-medium">
                    {info.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 font-semibold">Emplacement</p>
                  <p className="font-medium">{info.address}, {info.city}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Formulaire de message interactif */}
          <div className="lg:col-span-6 bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-2">Envoyez-nous un message</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Votre message sera instantanément transmis à l'équipe Burger & Co.
            </p>

            {formSent ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-emerald-300 font-bold">Message transmis avec succès !</p>
                <p className="text-zinc-400 text-xs">
                  La fenêtre WhatsApp s'est ouverte avec votre texte préparé.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="px-4 py-2 bg-zinc-800 text-xs text-white rounded-lg hover:bg-zinc-700"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Babacar Diop"
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Votre numéro de téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +221 77 123 45 67"
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Votre message ou détail de commande *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre demande, burgers souhaités ou question..."
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-contact-form"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer via WhatsApp</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
