import React, { useState } from 'react';
import { GalleryItem } from '../../types/burger';
import { ImageUploader } from './ImageUploader';
import { Plus, Trash2, Edit2, X, MoveUp, MoveDown } from 'lucide-react';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onUpdateGallery: (items: GalleryItem[]) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ gallery, onUpdateGallery }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const startAdd = () => {
    setEditingItem(null);
    setIsAdding(true);
    setTitle('');
    setCaption('');
    setImageUrl('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80');
  };

  const startEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setTitle(item.title);
    setCaption(item.caption || '');
    setImageUrl(item.imageUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    if (isAdding) {
      const newItem: GalleryItem = {
        id: 'gal-' + Date.now(),
        title: title.trim(),
        caption: caption.trim() || undefined,
        imageUrl: imageUrl.trim(),
        order: gallery.length + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onUpdateGallery([...gallery, newItem]);
      setIsAdding(false);
    } else if (editingItem) {
      const updated = gallery.map(g => {
        if (g.id === editingItem.id) {
          return {
            ...g,
            title: title.trim(),
            caption: caption.trim() || undefined,
            imageUrl: imageUrl.trim()
          };
        }
        return g;
      });
      onUpdateGallery(updated);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Supprimer cette photo de la galerie ?")) {
      onUpdateGallery(gallery.filter(g => g.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...gallery];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    // Réassigner les numéros d'ordre
    const ordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateGallery(ordered);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-base">Galerie Photos ({gallery.length})</h3>
          <p className="text-xs text-zinc-400">
            Ajoutez, remplacez, supprimez et réorganisez les photos du restaurant.
          </p>
        </div>
        <button
          onClick={startAdd}
          className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une photo</span>
        </button>
      </div>

      {/* Formulaire modal */}
      {(isAdding || editingItem) && (
        <div className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h4 className="text-white font-bold text-base">
              {isAdding ? 'Ajouter une photo à la galerie' : 'Modifier la photo'}
            </h4>
            <button
              onClick={() => { setEditingItem(null); setIsAdding(false); }}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Titre de la photo *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Cuisson des smash burgers sur plancha vive"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Légende / Description</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ex: Pains briochés toastés au beurre chaque matin"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <ImageUploader
              label="Sélectionner ou importer l'image"
              currentUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
              folder="gallery"
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => { setEditingItem(null); setIsAdding(false); }}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl shadow-lg"
              >
                Enregistrer la photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grille des photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item, index) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 bg-black">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/70 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                Position #{index + 1}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                {item.caption && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{item.caption}</p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded"
                    title="Monter"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === gallery.length - 1}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded"
                    title="Descendre"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
