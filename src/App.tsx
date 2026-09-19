import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { InstagramSection } from './components/InstagramSection';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CartFloatingButton } from './components/cart/CartFloatingButton';
import { loadSiteData, persistSiteData } from './services/siteService';
import { getLocalCurrentAdmin, logoutAdmin } from './services/adminAuth';
import { SiteData, AdminUser, MenuItem } from './types/burger';
import { CartItem } from './types/order';
import { INITIAL_SITE_DATA } from './data/initialData';
import { Loader2 } from 'lucide-react';

const CART_STORAGE_KEY = 'burger_and_co_cart_v1';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // État du panier client
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sauvegarde automatique du panier dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const handleAddToCart = (product: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description
        },
        quantity: 1
      }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Charger les données initiales et la session admin existante
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      try {
        const data = await loadSiteData();
        setSiteData(data);

        const existingAdmin = getLocalCurrentAdmin();
        if (existingAdmin) {
          setCurrentAdmin(existingAdmin);
        }

        // Vérifier si l'URL contient #admin ou /admin
        if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
          if (existingAdmin) {
            setIsAdminView(true);
          } else {
            setShowLoginModal(true);
          }
        }
      } catch (e) {
        console.error('Error initializing app:', e);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setIsAdminView(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setShowLoginModal(false);
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentAdmin(null);
    setIsAdminView(false);
    window.location.hash = '';
  };

  const handleSaveSiteData = async (newData: SiteData) => {
    setSiteData(newData);
    await persistSiteData(newData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center text-2xl shadow-xl shadow-amber-400/20 mb-4 animate-bounce">
          B&C
        </div>
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-2" />
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
          Chargement de Burger & Co...
        </p>
      </div>
    );
  }

  // Si l'administrateur est connecté et sur la vue d'administration
  if (isAdminView && currentAdmin) {
    return (
      <AdminDashboard
        currentAdmin={currentAdmin}
        siteData={siteData}
        onSaveSiteData={handleSaveSiteData}
        onLogout={handleLogout}
        onViewPublicSite={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-400 selection:text-black">
      
      {/* Header Public */}
      <Header
        info={siteData.info}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdminLogin={() => {
          if (currentAdmin) {
            setIsAdminView(true);
          } else {
            setShowLoginModal(true);
          }
        }}
      />

      {/* Hero Section */}
      <Hero
        hero={siteData.hero}
        info={siteData.info}
        onNavigateMenu={() => handleNavigate('menu')}
        onNavigateContact={() => handleNavigate('location')}
      />

      {/* Menu & Burgers */}
      <MenuSection
        categories={siteData.categories}
        products={siteData.products}
        info={siteData.info}
        onAddToCart={handleAddToCart}
      />

      {/* À Propos & Savoir-faire */}
      <AboutSection info={siteData.info} />

      {/* Galerie Photos */}
      <GallerySection gallery={siteData.gallery} />

      {/* Instagram @burger_and_co_sn */}
      <InstagramSection info={siteData.info} />

      {/* Localisation & Horaires */}
      <LocationSection info={siteData.info} />

      {/* Contact & WhatsApp Direct */}
      <ContactSection info={siteData.info} />

      {/* Footer */}
      <Footer
        info={siteData.info}
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => {
          if (currentAdmin) {
            setIsAdminView(true);
          } else {
            setShowLoginModal(true);
          }
        }}
      />

      {/* Panier & Commande Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        info={siteData.info}
      />

      {/* Bouton flottant de panier */}
      <CartFloatingButton
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modal de Connexion / Premier Super Admin */}
      {showLoginModal && (
        <AdminLoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

    </div>
  );
}
