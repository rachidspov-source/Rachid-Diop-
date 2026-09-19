import React, { useState } from 'react';
import { CartItem, Order, OrderType, PaymentMethod } from '../../types/order';
import { RestaurantInfo } from '../../types/burger';
import { createOrder, generateOrderId } from '../../services/orderService';
import { playOrderNotificationSound } from '../../services/soundService';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  Store, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Phone,
  User,
  Loader2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  info: RestaurantInfo;
}

const DELIVERY_ZONES = [
  { name: 'Almadies / Ngor / Virage', fee: 1500 },
  { name: 'Mamelles / Ouakam', fee: 1500 },
  { name: 'Mermoz / Sacré-Cœur / VDN', fee: 1500 },
  { name: 'Fann / Point E / Amitié', fee: 1500 },
  { name: 'Plateau / Médina / Centenaire', fee: 2000 },
  { name: 'Yoff / Ouest Foire / Nord Foire', fee: 2000 },
  { name: 'Maristes / Hann Maristes', fee: 2500 },
  { name: 'Autre zone de Dakar', fee: 2500 },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  info
}) => {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0].name);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const currentZoneObj = DELIVERY_ZONES.find(z => z.name === selectedZone);
  const deliveryFee = orderType === 'delivery' ? (currentZoneObj?.fee || 1500) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (orderType === 'delivery' && !deliveryAddress.trim()) return;

    setIsSubmitting(true);
    try {
      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        deliveryArea: orderType === 'delivery' ? selectedZone : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          options: item.instructions
        })),
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: notes.trim() || undefined
      };

      // Sauvegarde et notification
      await createOrder(newOrder);
      playOrderNotificationSound();
      setConfirmedOrder(newOrder);
      onClearCart();
    } catch (err) {
      console.error('Error submitting order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppConfirmationMessage = (order: Order) => {
    let msg = `Bonjour Burger & Co ! Je viens de valider la commande *#${order.id}* :\n\n`;
    msg += `👤 *Client :* ${order.customerName} (${order.customerPhone})\n`;
    msg += `🛵 *Mode :* ${order.orderType === 'delivery' ? `Livraison (${order.deliveryArea} - ${order.deliveryAddress})` : 'À emporter au comptoir'}\n`;
    msg += `💳 *Paiement :* ${order.paymentMethod === 'wave' ? 'Wave' : order.paymentMethod === 'orange_money' ? 'Orange Money' : 'Espèces à la réception'}\n\n`;
    msg += `📋 *Détail de la commande :*\n`;
    order.items.forEach(it => {
      msg += `• ${it.quantity}x ${it.name} - ${(it.price * it.quantity).toLocaleString('fr-FR')} FCFA\n`;
    });
    if (order.deliveryFee > 0) {
      msg += `• Frais de livraison : ${order.deliveryFee.toLocaleString('fr-FR')} FCFA\n`;
    }
    msg += `\n*TOTAL : ${order.total.toLocaleString('fr-FR')} FCFA*\n`;
    if (order.notes) {
      msg += `\n📝 *Notes :* ${order.notes}\n`;
    }
    msg += `\nMerci de confirmer la réception de ma commande !`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide Drawer Panel */}
      <div className="relative w-full max-w-lg bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col h-full z-10 overflow-hidden">
        
        {/* Header Drawer */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase text-white tracking-wide">
                Mon Panier & Commande
              </h2>
              <span className="text-xs text-amber-400 font-medium">
                {cartItems.length} {cartItems.length > 1 ? 'articles' : 'article'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENU : ÉCRAN DE CONFIRMATION SI COMMANDE VALIDÉE */}
        {confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500/40 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-black tracking-widest text-amber-400">
                Commande envoyée avec succès !
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">
                Merci {confirmedOrder.customerName}
              </h3>
              <div className="inline-block bg-zinc-900 border border-amber-400/40 rounded-xl px-4 py-1.5 mt-3 text-amber-400 font-mono font-black text-sm">
                N° COMMANDE : #{confirmedOrder.id}
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-left w-full space-y-3">
              <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                <span>Total à régler</span>
                <span className="text-amber-400 font-bold text-base">
                  {confirmedOrder.total.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="text-xs text-zinc-300 space-y-1">
                <p><strong>Mode :</strong> {confirmedOrder.orderType === 'delivery' ? `Livraison à ${confirmedOrder.deliveryArea}` : 'À emporter au restaurant'}</p>
                {confirmedOrder.deliveryAddress && (
                  <p><strong>Adresse :</strong> {confirmedOrder.deliveryAddress}</p>
                )}
                <p><strong>Paiement :</strong> {confirmedOrder.paymentMethod.toUpperCase()}</p>
                <p className="flex items-center gap-1 text-amber-300 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Temps de préparation estimé : 20 - 30 minutes</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Votre commande est immédiatement visible sur les écrans de cuisine des administrateurs. Vous pouvez également leur envoyer le récapitulatif directement par WhatsApp.
            </p>

            <div className="w-full space-y-2 pt-2">
              <a
                href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generateWhatsAppConfirmationMessage(confirmedOrder))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer le récapitulatif sur WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded-xl transition"
              >
                Fermer et continuer à naviguer
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* PANIER VIDE */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Votre panier est vide</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Découvrez nos smash burgers, frites fraîches et milkshakes gourmands pour composer votre commande.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl shadow-md transition"
            >
              Parcourir le menu
            </button>
          </div>
        ) : (
          /* LISTE DES ARTICLES & FORMULAIRE DE COMMANDE */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            
            {/* Liste des articles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Articles sélectionnés
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Vider le panier
                </button>
              </div>

              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <p className="text-amber-400 text-xs font-black mt-0.5">
                        {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {item.product.price.toLocaleString('fr-FR')} FCFA / unité
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire de validation client */}
            <form onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-zinc-800">
              
              {/* Type de commande */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Type de commande
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      orderType === 'delivery'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Livraison à domicile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      orderType === 'takeaway'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>À emporter</span>
                  </button>
                </div>
              </div>

              {/* Coordonnées Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Votre Nom & Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Aïssatou Diallo"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Téléphone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse si livraison */}
              {orderType === 'delivery' && (
                <div className="space-y-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                      Zone / Quartier de Dakar *
                    </label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.name} value={zone.name}>
                          {zone.name} (+{zone.fee.toLocaleString('fr-FR')} FCFA)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                      Adresse précise & repères *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                      <textarea
                        rows={2}
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Rue, N° villa, étage, en face de..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mode de paiement */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">
                  Mode de règlement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wave')}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'wave'
                        ? 'bg-amber-400 text-black border-amber-400 font-black'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Wave</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'orange_money'
                        ? 'bg-amber-400 text-black border-amber-400 font-black'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Orange Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-400 text-black border-amber-400 font-black'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Espèces</span>
                  </button>
                </div>
              </div>

              {/* Notes éventuelles */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Instructions ou précisions (optionnel)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: sans oignons, sauce à part, sonner fort..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Récapitulatif Total & Bouton Commander */}
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Sous-total articles</span>
                  <span className="text-white font-bold">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Frais de livraison ({selectedZone})</span>
                    <span className="text-white font-bold">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-white font-bold pt-1 border-t border-zinc-850">
                  <span className="text-base font-black">TOTAL</span>
                  <span className="text-base font-black text-amber-400">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi de votre commande...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer la commande • {total.toLocaleString('fr-FR')} FCFA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
