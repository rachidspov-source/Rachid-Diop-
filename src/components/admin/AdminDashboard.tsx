import React, { useState, useEffect } from 'react';
import { AdminUser, SiteData, HeroSettings, RestaurantInfo, Category, MenuItem, GalleryItem } from '../../types/burger';
import { MenuManager } from './MenuManager';
import { GalleryManager } from './GalleryManager';
import { ContentEditor } from './ContentEditor';
import { AdminUsersManager } from './AdminUsersManager';
import { OrdersManager } from './OrdersManager';
import { subscribeToOrders } from '../../services/orderService';
import { Order } from '../../types/order';
import { 
  LayoutDashboard, 
  ShoppingBag,
  UtensilsCrossed, 
  Camera, 
  Home, 
  MapPin, 
  Phone, 
  Share2, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink,
  Crown,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  BellRing
} from 'lucide-react';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  siteData: SiteData;
  onSaveSiteData: (newData: SiteData) => Promise<void>;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

type AdminView = 
  | 'overview' 
  | 'orders'
  | 'menu' 
  | 'gallery' 
  | 'hero' 
  | 'about'
  | 'location' 
  | 'contact' 
  | 'instagram' 
  | 'admins' 
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  siteData,
  onSaveSiteData,
  onLogout,
  onViewPublicSite
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

  useEffect(() => {
    const unsub = subscribeToOrders((orders: Order[]) => {
      setTotalOrdersCount(orders.length);
      const pending = orders.filter(o => o.status === 'pending').length;
      setPendingOrdersCount(pending);
    });
    return () => unsub();
  }, []);

  // Met à jour et persiste les données du site
  const handleUpdateHero = async (hero: HeroSettings) => {
    const updated = { ...siteData, hero };
    await onSaveSiteData(updated);
  };

  const handleUpdateInfo = async (info: RestaurantInfo) => {
    const updated = { ...siteData, info };
    await onSaveSiteData(updated);
  };

  const handleUpdateCategories = async (categories: Category[]) => {
    const updated = { ...siteData, categories };
    await onSaveSiteData(updated);
  };

  const handleUpdateProducts = async (products: MenuItem[]) => {
    const updated = { ...siteData, products };
    await onSaveSiteData(updated);
  };

  const handleUpdateGallery = async (gallery: GalleryItem[]) => {
    const updated = { ...siteData, gallery };
    await onSaveSiteData(updated);
  };

  const navMenuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
    { 
      id: 'orders', 
      label: 'Espace Commandes', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} NOUVELLES` : undefined,
      badgeColor: pendingOrdersCount > 0 ? 'bg-red-500 text-white animate-pulse' : undefined
    },
    { id: 'menu', label: 'Menu & Burgers', icon: UtensilsCrossed },
    { id: 'gallery', label: 'Galerie Photos', icon: Camera },
    { id: 'hero', label: 'Accueil / Hero', icon: Home },
    { id: 'location', label: 'Localisation', icon: MapPin },
    { id: 'contact', label: 'Contact & WhatsApp', icon: Phone },
    { id: 'instagram', label: 'Réseaux Sociaux', icon: Share2 },
    ...(currentAdmin.role === 'superadmin' ? [
      { id: 'admins', label: 'Gestion Administrateurs', icon: Users, badge: 'SuperAdmin' }
    ] : []),
    { id: 'settings', label: 'Paramètres & Logo', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-xl shadow-lg shadow-amber-400/20">
                B&C
              </div>
              <div>
                <h1 className="text-base font-black tracking-wide text-white uppercase">Burger & Co</h1>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Console d'administration
                </span>
              </div>
            </div>
          </div>

          {/* Profil Admin actif */}
          <div className="p-4 mx-4 my-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black">
              {currentAdmin.role === 'superadmin' ? <Crown className="w-5 h-5" /> : currentAdmin.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentAdmin.displayName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                  currentAdmin.role === 'superadmin' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {currentAdmin.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu de navigation */}
          <nav className="px-3 space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminView)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/10 font-black'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      (item as { badgeColor?: string }).badgeColor || 'bg-black/40 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pied de Sidebar */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={onViewPublicSite}
            className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Voir le site en direct</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-950 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border border-red-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* VUE TABLEAU DE BORD / VUE D'ENSEMBLE */}
          {currentView === 'overview' && (
            <div className="space-y-8">
              
              {/* Alerte si commandes en attente */}
              {pendingOrdersCount > 0 && (
                <div 
                  onClick={() => setCurrentView('orders')}
                  className="bg-red-500/10 border-2 border-red-500/60 hover:bg-red-500/20 p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition shadow-xl shadow-red-950/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center font-black animate-pulse shadow-md shadow-red-500/40">
                      <BellRing className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide">
                          {pendingOrdersCount} nouvelle{pendingOrdersCount > 1 ? 's' : ''} commande{pendingOrdersCount > 1 ? 's' : ''} en attente !
                        </h4>
                      </div>
                      <p className="text-xs text-red-300/90 mt-0.5">
                        Cliquez ici pour ouvrir l'Espace Commandes, lancer la cuisine et notifier les clients.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <span className="hidden sm:inline">Traiter maintenant</span>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Vue Globale</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                  Tableau de bord Burger & Co
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Bienvenue, <strong>{currentAdmin.displayName}</strong>. Vous pilotez l'ensemble du contenu public, des offres et des commandes en direct.
                </p>
              </div>

              {/* Cartes statistiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div 
                  onClick={() => setCurrentView('orders')}
                  className={`border p-5 rounded-2xl cursor-pointer transition shadow-lg relative ${
                    pendingOrdersCount > 0
                      ? 'bg-red-950/40 border-red-500/80 hover:border-red-400'
                      : 'bg-zinc-900 border-zinc-800 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Commandes</span>
                    <ShoppingBag className={`w-5 h-5 ${pendingOrdersCount > 0 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
                  </div>
                  <p className={`text-3xl font-black ${pendingOrdersCount > 0 ? 'text-red-400' : 'text-white'}`}>
                    {totalOrdersCount}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {pendingOrdersCount > 0 ? (
                      <span className="text-red-400 font-bold">{pendingOrdersCount} en attente</span>
                    ) : (
                      'Toutes gérées'
                    )}
                  </p>
                </div>
                <div 
                  onClick={() => setCurrentView('menu')}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 p-5 rounded-2xl cursor-pointer transition shadow-lg"
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Produits au Menu</span>
                    <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{siteData.products.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {siteData.products.filter(p => p.available).length} disponibles en ligne
                  </p>
                </div>

                <div 
                  onClick={() => setCurrentView('menu')}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 p-5 rounded-2xl cursor-pointer transition shadow-lg"
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Catégories</span>
                    <Layers className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{siteData.categories.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Burgers, Menus, Boissons...</p>
                </div>

                <div 
                  onClick={() => setCurrentView('gallery')}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 p-5 rounded-2xl cursor-pointer transition shadow-lg"
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Photos Galerie</span>
                    <Camera className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{siteData.gallery.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Format grille & visionneuse</p>
                </div>

                <div 
                  onClick={() => setCurrentView('admins')}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 p-5 rounded-2xl cursor-pointer transition shadow-lg"
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Votre Rôle</span>
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-amber-400 uppercase">{currentAdmin.role}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {currentAdmin.role === 'superadmin' ? 'Contrôle complet total' : 'Gestion contenu'}
                  </p>
                </div>
              </div>

              {/* Raccourcis rapides */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="p-4 bg-zinc-950 hover:bg-zinc-850 rounded-xl border border-zinc-800 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Ajouter un burger</p>
                      <p className="text-[11px] text-zinc-400">Nouveau smash, prix, photo</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView('gallery')}
                    className="p-4 bg-zinc-950 hover:bg-zinc-850 rounded-xl border border-zinc-800 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Publier une photo</p>
                      <p className="text-[11px] text-zinc-400">Nouveautés en cuisine</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView('contact')}
                    className="p-4 bg-zinc-950 hover:bg-zinc-850 rounded-xl border border-zinc-800 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">Modifier WhatsApp</p>
                      <p className="text-[11px] text-zinc-400">Numéro direct commandes</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Information Synchronisation & Sécurité */}
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Administration 100% Réactive & Persistante</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Toute modification enregistrée dans ce tableau de bord (textes, prix, images, horaires, burger) est immédiatement synchronisée et s'affiche instantanément sur le site public de Burger & Co.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* VUE ESPACE COMMANDES EN DIRECT */}
          {currentView === 'orders' && (
            <OrdersManager
              currentAdmin={currentAdmin}
              info={siteData.info}
            />
          )}

          {/* VUE GESTION DU MENU */}
          {currentView === 'menu' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Gestion de la Carte & des Produits
              </h2>
              <MenuManager
                categories={siteData.categories}
                products={siteData.products}
                onUpdateCategories={handleUpdateCategories}
                onUpdateProducts={handleUpdateProducts}
              />
            </div>
          )}

          {/* VUE GALERIE */}
          {currentView === 'gallery' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Gestion de la Galerie Photos
              </h2>
              <GalleryManager
                gallery={siteData.gallery}
                onUpdateGallery={handleUpdateGallery}
              />
            </div>
          )}

          {/* VUES ÉDITEUR DE CONTENU (HERO, ABOUT, LOCATION, CONTACT, INSTAGRAM, SETTINGS) */}
          {currentView === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Édition de l'Accueil (Hero)
              </h2>
              <ContentEditor
                hero={siteData.hero}
                info={siteData.info}
                onUpdateHero={handleUpdateHero}
                onUpdateInfo={handleUpdateInfo}
                section="hero"
              />
            </div>
          )}

          {currentView === 'location' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Localisation & Horaires
              </h2>
              <ContentEditor
                hero={siteData.hero}
                info={siteData.info}
                onUpdateHero={handleUpdateHero}
                onUpdateInfo={handleUpdateInfo}
                section="location"
              />
            </div>
          )}

          {currentView === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Contact & Commande WhatsApp
              </h2>
              <ContentEditor
                hero={siteData.hero}
                info={siteData.info}
                onUpdateHero={handleUpdateHero}
                onUpdateInfo={handleUpdateInfo}
                section="contact"
              />
            </div>
          )}

          {currentView === 'instagram' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Section Réseau Social Instagram
              </h2>
              <ContentEditor
                hero={siteData.hero}
                info={siteData.info}
                onUpdateHero={handleUpdateHero}
                onUpdateInfo={handleUpdateInfo}
                section="instagram"
              />
            </div>
          )}

          {currentView === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Paramètres du Restaurant & Logo
              </h2>
              <ContentEditor
                hero={siteData.hero}
                info={siteData.info}
                onUpdateHero={handleUpdateHero}
                onUpdateInfo={handleUpdateInfo}
                section="settings"
              />
            </div>
          )}

          {/* VUE GESTION DES ADMINISTRATEURS (SUPERADMIN ONLY) */}
          {currentView === 'admins' && (
            <div className="space-y-6">
              <AdminUsersManager currentAdmin={currentAdmin} />
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
