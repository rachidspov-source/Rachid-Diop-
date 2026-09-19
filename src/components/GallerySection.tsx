import React, { useState } from 'react';
import { GalleryItem } from '../types/burger';
import { Camera, X, ZoomIn } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const sortedGallery = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <section id="gallery" className="py-20 bg-zinc-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Camera className="w-4 h-4" />
            <span>Instants Gourmands</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Galerie Burger & Co
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Plongez dans l'ambiance de notre cuisine, découvrez nos préparations et le dressage de nos burgers.
          </p>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGallery.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => setActivePhoto(item)}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer bg-zinc-950 border border-zinc-800 shadow-md hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Icône Zoom au survol */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                <ZoomIn className="w-5 h-5 text-amber-400" />
              </div>

              {/* Titre & Légende */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-left">
                <h4 className="text-white font-black text-base group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-zinc-300 text-xs line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activePhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActivePhoto(null)}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div 
              className="max-w-4xl max-h-[85vh] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
              <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                <h3 className="text-xl font-black text-amber-400">{activePhoto.title}</h3>
                {activePhoto.caption && (
                  <p className="text-zinc-300 text-sm mt-1">{activePhoto.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
