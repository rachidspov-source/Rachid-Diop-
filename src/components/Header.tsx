import React, { useState } from 'react';
import { Menu, X, Instagram, Phone, MapPin, Clock, Lock, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { RestaurantInfo } from '../types/burger';

interface HeaderProps {
  info: RestaurantInfo;
  onNavigate: (sectionId: string) => void;
  onOpenAdminLogin: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  info, 
  onNavigate, 
  onOpenAdminLogin,
  cartCount = 0,
  onOpenCart 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', id: 'hero' },
    { label: 'Menu', id: 'menu' },
    { label: 'À propos', id: 'about' },
    { label: 'Galerie', id: 'gallery' },
    { label: 'Instagram', id: 'instagram' },
    { label: 'Localisation', id: 'location' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-amber-500/20 text-white transition-all">
      {/* Barre d'alerte / WhatsApp rapide */}
      <div className="bg-amber-400 text-black text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse"></span>
        <span>Commandes directes au restaurant : Panier en ligne & WhatsApp disponibles 7j/7</span>
        {onOpenCart ? (
          <button 
            onClick={onOpenCart}
            className="underline ml-2 hover:opacity-80 transition font-black cursor-pointer"
          >
            Ouvrir mon panier {cartCount > 0 ? `(${cartCount})` : ''} &rarr;
          </button>
        ) : (
          <a 
            href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline ml-2 hover:opacity-80 transition font-black"
          >
            Commander maintenant &rarr;
          </a>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo / Nom de marque */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="cursor-pointer flex items-center gap-3 group"
          id="brand-logo-container"
        >
          {info.logoUrl ? (
            <img 
              src={info.logoUrl} 
              alt={info.name} 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-xl shadow-lg shadow-amber-400/20 group-hover:rotate-6 transition-transform">
                B&C
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-amber-400 transition-colors uppercase">
                  {info.name}
                </span>
                <span className="block text-[10px] tracking-widest text-zinc-400 uppercase font-semibold">
                  Smash & Gourmet Burgers
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-zinc-300 hover:text-amber-400 transition-colors py-1 cursor-pointer font-medium tracking-wide"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Bouton Panier en ligne */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              id="btn-header-cart"
              className="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-amber-400 font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Panier</span>
            </button>
          )}

          <a
            href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-header-order-whatsapp"
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black px-4 py-2.5 rounded-xl shadow-md shadow-amber-400/10 hover:shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenAdminLogin}
            id="btn-header-admin-login"
            title="Espace Administrateur"
            className="p-2.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Bouton Hamburger & Panier Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-zinc-900 text-amber-400 rounded-xl border border-zinc-800"
              title="Mon Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenAdminLogin}
            title="Espace Administrateur"
            className="p-2 text-zinc-400 hover:text-amber-400"
          >
            <Lock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="btn-mobile-menu-toggle"
            aria-label="Menu de navigation"
            className="p-2.5 text-zinc-300 hover:text-amber-400 bg-zinc-900 rounded-xl border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-amber-400/20 px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-lg font-bold text-zinc-200 hover:text-amber-400 py-2 border-b border-zinc-900"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {onOpenCart && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black font-black py-3 rounded-xl shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Mon Panier & Commande ({cartCount} article{cartCount > 1 ? 's' : ''})</span>
              </button>
            )}

            <a
              href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold py-3 rounded-xl border border-zinc-800"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Commander via WhatsApp</span>
            </a>

            <a
              href={info.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold py-3 rounded-xl border border-zinc-800"
            >
              <Instagram className="w-5 h-5 text-amber-400" />
              <span>{info.instagramHandle}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

