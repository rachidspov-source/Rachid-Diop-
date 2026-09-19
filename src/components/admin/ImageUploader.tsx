import React, { useRef, useState } from 'react';
import { uploadImageFile } from '../../services/siteService';
import { UploadCloud, Image as ImageIcon, Sparkles, Check, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  currentUrl: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  folder?: string;
}

const PHOTO_PRESETS = [
  { label: 'Smash Signature', url: '/images/burger_signature.jpg' },
  { label: 'Double Cheese', url: '/images/double_cheeseburger.jpg' },
  { label: 'BBQ Bacon', url: '/images/bbq_burger.jpg' },
  { label: 'Crispy Chicken', url: '/images/crispy_chicken.jpg' },
  { label: 'Assiette Kafta', url: '/images/assiette_kafta.jpg' },
  { label: 'Tenders Box', url: '/images/chicken_tenders.jpg' },
  { label: 'Loaded Fries', url: '/images/loaded_fries.jpg' },
  { label: 'Frites Maison', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80' },
  { label: 'Menu Duo Pack', url: '/images/menu_duo.jpg' },
  { label: 'Milkshake Oreo', url: '/images/milkshake_oreo.jpg' },
  { label: 'Jus Bissap / Frais', url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80' },
  { label: 'Maxi Cookie', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80' },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onImageUploaded,
  label = "Photo / Image",
  folder = "uploads"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrl = await uploadImageFile(file, folder);
      onImageUploaded(uploadedUrl);
    } catch (err: any) {
      setError(err.message || 'Échec du traitement de l\'image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onImageUploaded(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-xs font-bold text-zinc-300">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
          >
            <Sparkles className="w-3 h-3" />
            <span>{showPresets ? 'Fermer suggestions' : 'Photos suggérées'}</span>
          </button>
          <span className="text-zinc-700 text-xs">|</span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-zinc-400 hover:text-white transition"
          >
            {showUrlInput ? 'Cacher URL' : 'Coller une URL'}
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... ou /images/mon_burger.jpg"
            className="flex-1 bg-zinc-900 border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-amber-400 text-black text-xs font-bold rounded-lg hover:bg-amber-300 transition"
          >
            Appliquer
          </button>
        </div>
      )}

      {showPresets && (
        <div className="p-3 bg-zinc-950 border border-amber-400/30 rounded-xl space-y-2">
          <p className="text-[11px] text-zinc-400 font-medium">
            Cliquez sur une photo pour l'appliquer immédiatement :
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {PHOTO_PRESETS.map((preset, idx) => {
              const isSelected = currentUrl === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onImageUploaded(preset.url);
                    setShowPresets(false);
                  }}
                  className={`group relative rounded-lg overflow-hidden border transition p-0.5 text-left ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-14 object-cover rounded"
                  />
                  <div className="text-[9px] font-bold text-zinc-300 truncate mt-1 px-1">
                    {preset.label}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5 shadow">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Aperçu */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-zinc-600" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Zone de drop / upload */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload-input"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-zinc-700 hover:border-amber-400/80 bg-zinc-900/50 hover:bg-zinc-900 p-4 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5"
          >
            <UploadCloud className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-zinc-200">
              {uploading ? 'Importation en cours...' : 'Changer la photo depuis vos fichiers'}
            </span>
            <span className="text-[10px] text-zinc-500">
              Glisser-déposer ou cliquer (JPG, PNG, WebP)
            </span>
          </button>

          {error && (
            <p className="text-[11px] text-red-400 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

