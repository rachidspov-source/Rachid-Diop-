import React, { useState } from 'react';
import { MenuItem, Category, RestaurantInfo } from '../types/burger';
import { Flame, MessageCircle, Sparkles, AlertCircle, Search, ShoppingBag, Check } from 'lucide-react';

interface MenuSectionProps {
  categories: Category[];
  products: MenuItem[];
  info: RestaurantInfo;
  onAddToCart?: (product: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ categories, products, info, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleAddToCart = (product: MenuItem) => {
    if (onAddToCart) {
      onAddToCart(product);
      setJustAddedId(product.id);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  // Trier les catégories par ordre
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // Filtrer les produits
  const filteredProducts = products.filter(prod => {
    // Ne montrer que les produits disponibles pour le public
    if (!prod.available) return false;
    
    // Filtrage catégorie
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }

    // Filtrage recherche
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return prod.name.toLowerCase().includes(q) || prod.description.toLowerCase().includes(q);
    }

    return true;
  }).sort((a, b) => a.order - b.order);

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Best-seller':
        return 'bg-amber-400 text-black font-black border border-amber-300';
      case 'Spécial Chef':
        return 'bg-red-600 text-white font-bold border border-red-500';
      case 'Nouveau':
        return 'bg-emerald-500 text-black font-bold';
      case 'Promo':
        return 'bg-purple-600 text-white font-bold';
      default:
        return 'bg-zinc-800 text-amber-400 border border-zinc-700';
    }
  };

  const handleOrderWhatsApp = (product: MenuItem) => {
    const message = `Bonjour Burger & Co, je souhaite commander : *${product.name}* (${product.price.toLocaleString('fr-FR')} FCFA). Merci !`;
    const url = `https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="menu" className="py-20 bg-zinc-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Notre Carte Gourmande</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Des Burgers d'Exception
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Des recettes signatures préparées à la commande, du pain brioché artisanal et du pur bœuf smashé.
          </p>
        </div>

        {/* Barre de recherche et filtres de catégories */}
        <div className="mb-10 space-y-6">
          {/* Recherche */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un burger, un accompagnement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-700/70 focus:border-amber-400 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>

          {/* Boutons Catégories (Scrollable sur mobile) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              Tous les délices
            </button>

            {sortedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des produits */}
        {filteredProducts.length === 0 ? (
          <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 p-12 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
            <p className="text-lg font-bold text-white">Aucun produit trouvé</p>
            <p className="text-sm text-zinc-400 mt-1">
              Essayez une autre recherche ou sélectionnez une autre catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-950 border border-zinc-800/80 hover:border-amber-400/40 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-amber-400/5"
              >
                {/* Photo Produit */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-lg ${getBadgeStyle(product.badge)}`}>
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Prix Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md border border-amber-400/30 text-amber-400 font-black px-3 py-1 rounded-xl text-base shadow-md">
                    {product.price.toLocaleString('fr-FR')} <span className="text-xs text-white">FCFA</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions de commande */}
                  <div className="pt-3 border-t border-zinc-850 flex items-center justify-between gap-2">
                    {onAddToCart ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition transform cursor-pointer shadow-md ${
                          justAddedId === product.id
                            ? 'bg-emerald-500 text-black scale-95'
                            : 'bg-amber-400 hover:bg-amber-300 text-black hover:scale-[1.02] shadow-amber-400/20'
                        }`}
                      >
                        {justAddedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Ajouté au panier !</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Ajouter au panier</span>
                          </>
                        )}
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleOrderWhatsApp(product)}
                      className="p-2.5 bg-zinc-850 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 rounded-xl transition border border-zinc-700/60"
                      title="Commander directement sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note de bas de menu */}
        <div className="mt-14 p-6 bg-zinc-950/70 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-white font-bold text-sm">
              Envie d'une personnalisation ou d'une commande de groupe ?
            </p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Contactez directement notre équipe par WhatsApp pour réserver ou commander.
            </p>
          </div>
          <a
            href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(info.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-400/50 text-amber-400 hover:text-white font-bold rounded-xl text-sm transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Écrire à l'équipe</span>
          </a>
        </div>

      </div>
    </section>
  );
};
