import React, { useState } from 'react';
import { MenuItem, Category } from '../../types/burger';
import { ImageUploader } from './ImageUploader';
import { Plus, Trash2, Edit2, Check, X, Eye, EyeOff, RotateCcw, Search, Camera } from 'lucide-react';
import { INITIAL_SITE_DATA } from '../../data/initialData';

interface MenuManagerProps {
  categories: Category[];
  products: MenuItem[];
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateProducts: (products: MenuItem[]) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  categories,
  products,
  onUpdateCategories,
  onUpdateProducts
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSelectedCategory, setAdminSelectedCategory] = useState('all');

  // Nouvelles catégories
  const [newCategoryName, setNewCategoryName] = useState('');

  // Formulaire produit
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(5000);
  const [prodCategory, setProdCategory] = useState<string>(categories[0]?.id || '');
  const [prodImage, setProdImage] = useState<string>('');
  const [prodBadge, setProdBadge] = useState<string>('');
  const [prodAvailable, setProdAvailable] = useState<boolean>(true);

  const startEditProduct = (prod: MenuItem) => {
    setEditingProduct(prod);
    setIsCreatingProduct(false);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdImage(prod.imageUrl);
    setProdBadge(prod.badge || '');
    setProdAvailable(prod.available);
  };

  const startNewProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
    setProdName('');
    setProdDesc('');
    setProdPrice(5000);
    setProdCategory(categories[0]?.id || '');
    setProdImage('/images/burger_signature.jpg');
    setProdBadge('');
    setProdAvailable(true);
  };

  const handleResetToOfficialMenu = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tout le menu avec les photos et recettes officielles de Burger & Co ?")) {
      onUpdateProducts(INITIAL_SITE_DATA.products);
      onUpdateCategories(INITIAL_SITE_DATA.categories);
      setEditingProduct(null);
      setIsCreatingProduct(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (isCreatingProduct) {
      const newProd: MenuItem = {
        id: 'prod-' + Date.now(),
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: Number(prodPrice),
        category: prodCategory,
        imageUrl: prodImage || '/images/burger_signature.jpg',
        badge: prodBadge.trim() || undefined,
        available: prodAvailable,
        order: products.length + 1
      };
      onUpdateProducts([...products, newProd]);
      setIsCreatingProduct(false);
    } else if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: prodName.trim(),
            description: prodDesc.trim(),
            price: Number(prodPrice),
            category: prodCategory,
            imageUrl: prodImage || p.imageUrl,
            badge: prodBadge.trim() || undefined,
            available: prodAvailable
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit du menu ?")) {
      onUpdateProducts(products.filter(p => p.id !== id));
      if (editingProduct?.id === id) setEditingProduct(null);
    }
  };

  const handleToggleAvailability = (id: string) => {
    onUpdateProducts(products.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCategoryName.trim(),
      slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
      order: categories.length + 1
    };
    onUpdateCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catId: string) => {
    if (window.confirm("Supprimer cette catégorie ? Les produits qui lui sont rattachés resteront modifiables.")) {
      onUpdateCategories(categories.filter(c => c.id !== catId));
    }
  };

  const filteredProducts = products.filter(p => {
    if (adminSelectedCategory !== 'all' && p.category !== adminSelectedCategory) return false;
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Sélecteur d'onglets */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'products'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Produits & Plats ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Catégories du Menu ({categories.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-zinc-400">
              Gérez les burgers, tarifs, accompagnements et photos en temps réel. Cliquez sur n'importe quel burger pour modifier ses photos.
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResetToOfficialMenu}
                title="Rétablir le menu officiel complet avec toutes les photos"
                className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Réinitialiser au menu officiel</span>
                <span className="sm:hidden">Réinitialiser</span>
              </button>
              <button
                onClick={startNewProduct}
                className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau produit</span>
              </button>
            </div>
          </div>

          {/* Filtres & Recherche admin */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Rechercher parmi les produits..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <select
              value={adminSelectedCategory}
              onChange={(e) => setAdminSelectedCategory(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Toutes les catégories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({products.filter(p => p.category === c.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Modal / Formulaire d'édition produit */}
          {(isCreatingProduct || editingProduct) && (
            <div className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h4 className="text-white font-bold text-base">
                  {isCreatingProduct ? 'Ajouter un nouveau produit au menu' : `Modifier "${editingProduct?.name}"`}
                </h4>
                <button
                  onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Nom du produit *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="Ex: Le Double Smash Bacon"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Prix (FCFA) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Catégorie *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Badge éventuel (optionnel)</label>
                    <input
                      type="text"
                      value={prodBadge}
                      onChange={(e) => setProdBadge(e.target.value)}
                      placeholder="Ex: Best-seller, Nouveau, Spécial Chef, Populaire..."
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Description & Ingrédients *</label>
                  <textarea
                    rows={3}
                    required
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Pain brioché, bœuf smashé, cheddar fondu, sauce secrète..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Upload & Sélection Photo */}
                <ImageUploader
                  label="Photo du burger ou produit (cliquez sur 'Photos suggérées' ou importez la vôtre)"
                  currentUrl={prodImage}
                  onImageUploaded={(url) => setProdImage(url)}
                  folder="products"
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="product-available-cb"
                    checked={prodAvailable}
                    onChange={(e) => setProdAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-zinc-950 border-zinc-700 cursor-pointer"
                  />
                  <label htmlFor="product-available-cb" className="text-xs text-zinc-200 font-medium cursor-pointer">
                    Produit disponible à la vente (décocher pour masquer temporairement au public)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl shadow-lg"
                  >
                    Enregistrer le produit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des produits existants */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800">
            {filteredProducts.map((prod) => {
              const catObj = categories.find(c => c.id === prod.category);
              return (
                <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-850/50 transition">
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => startEditProduct(prod)}
                      className="relative group/thumb cursor-pointer shrink-0"
                      title="Cliquez pour modifier la photo"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-700 group-hover/thumb:border-amber-400 transition"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 rounded-xl flex items-center justify-center transition text-amber-400">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 
                          onClick={() => startEditProduct(prod)}
                          className="text-sm font-bold text-white hover:text-amber-400 transition cursor-pointer"
                        >
                          {prod.name}
                        </h4>
                        {prod.badge && (
                          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded">
                            {prod.badge}
                          </span>
                        )}
                        {!prod.available && (
                          <span className="text-[10px] font-bold bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                            Masqué / Épuisé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{prod.description}</p>
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="text-amber-400 font-bold">{prod.price.toLocaleString('fr-FR')} FCFA</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">{catObj?.name || 'Sans catégorie'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleAvailability(prod.id)}
                      title={prod.available ? "Désactiver le produit" : "Activer le produit"}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                        prod.available ? 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {prod.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEditProduct(prod)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg flex items-center gap-1 text-xs font-bold transition"
                      title="Modifier les infos ou la photo"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden md:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* ONGLET CATÉGORIES */
        <div className="space-y-6">
          <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
            <input
              type="text"
              required
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la nouvelle catégorie (ex: Tacos, Salades...)"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-black font-black text-xs rounded-xl hover:bg-amber-300 transition"
            >
              Ajouter
            </button>
          </form>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                  <p className="text-[11px] text-zinc-500">Identifiant : {cat.id}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                  title="Supprimer catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
