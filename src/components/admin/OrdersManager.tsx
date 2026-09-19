import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types/order';
import { AdminUser, RestaurantInfo } from '../../types/burger';
import { 
  subscribeToOrders, 
  updateOrderStatus, 
  deleteOrder, 
  createOrder,
  generateOrderId 
} from '../../services/orderService';
import { 
  playOrderNotificationSound, 
  requestBrowserNotificationPermission, 
  sendBrowserNotification 
} from '../../services/soundService';
import { 
  Bell, 
  BellRing, 
  Volume2, 
  VolumeX, 
  Search, 
  Check, 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageCircle, 
  Printer, 
  Trash2, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  X,
  MapPin,
  User,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface OrdersManagerProps {
  currentAdmin: AdminUser;
  info: RestaurantInfo;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({ currentAdmin, info }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasBrowserNotification, setHasBrowserNotification] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  
  // Modal pour ajouter manuellement une commande par téléphone
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualItemsText, setManualItemsText] = useState('2x Smash Burger Signature, 1x Frites Maison');
  const [manualTotal, setManualTotal] = useState(13000);
  const [manualType, setManualType] = useState<'delivery' | 'takeaway'>('delivery');

  // Souscription temps réel aux commandes
  useEffect(() => {
    // Vérifier permission notification système
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasBrowserNotification(Notification.permission === 'granted');
    }

    const unsubscribe = subscribeToOrders((latestOrders, newlyCreatedOrder) => {
      setOrders(latestOrders);

      if (newlyCreatedOrder) {
        // Nouvelle commande reçue !
        if (soundEnabled) {
          playOrderNotificationSound();
        }
        sendBrowserNotification(
          `🚨 Nouvelle commande #${newlyCreatedOrder.id}`,
          `${newlyCreatedOrder.customerName} - ${newlyCreatedOrder.total.toLocaleString('fr-FR')} FCFA (${newlyCreatedOrder.orderType === 'delivery' ? 'Livraison' : 'À emporter'})`
        );
        setNewOrderAlert(newlyCreatedOrder);
        // Masquer l'alerte visuelle après 15 secondes
        setTimeout(() => {
          setNewOrderAlert((prev) => (prev?.id === newlyCreatedOrder.id ? null : prev));
        }, 15000);
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playOrderNotificationSound();
    }
  };

  const handleTestChime = () => {
    playOrderNotificationSound();
  };

  const handleEnableNotifications = async () => {
    const granted = await requestBrowserNotificationPermission();
    setHasBrowserNotification(granted);
    if (granted) {
      sendBrowserNotification('Burger & Co - Notifications activées', 'Vous recevrez une alerte sonore et système à chaque commande !');
    }
  };

  const handleChangeStatus = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Voulez-vous supprimer définitivement la commande #${orderId} ?`)) {
      await deleteOrder(orderId);
    }
  };

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket Commande #${order.id} - Burger & Co</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 320px; margin: 0 auto; }
            h1 { font-size: 18px; text-align: center; margin: 0; text-transform: uppercase; }
            p { margin: 4px 0; font-size: 12px; }
            hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
            .total { font-size: 14px; font-weight: bold; }
            .item-row { display: flex; justify-content: space-between; font-size: 12px; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <h1>BURGER & CO</h1>
          <p class="center">Smash & Gourmet Burgers - Dakar</p>
          <p class="center">Tél: ${info.phone}</p>
          <hr />
          <p><strong>COMMANDE : #${order.id}</strong></p>
          <p>Date : ${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
          <p>Client : ${order.customerName}</p>
          <p>Tél : ${order.customerPhone}</p>
          <p>Type : <strong>${order.orderType === 'delivery' ? 'LIVRAISON À DOMICILE' : 'À EMPORTER'}</strong></p>
          ${order.deliveryAddress ? `<p>Adresse : ${order.deliveryAddress} (${order.deliveryArea || ''})</p>` : ''}
          <p>Règlement : ${order.paymentMethod.toUpperCase()}</p>
          <hr />
          <p><strong>ARTICLES :</strong></p>
          ${order.items.map(it => `
            <div class="item-row">
              <span>${it.quantity}x ${it.name}</span>
              <span>${(it.price * it.quantity).toLocaleString('fr-FR')} F</span>
            </div>
            ${it.options ? `<p style="font-size: 10px; padding-left: 10px; color: #555;">> ${it.options}</p>` : ''}
          `).join('')}
          <hr />
          ${order.deliveryFee > 0 ? `
            <div class="item-row">
              <span>Frais livraison :</span>
              <span>${order.deliveryFee.toLocaleString('fr-FR')} F</span>
            </div>
          ` : ''}
          <div class="item-row total">
            <span>TOTAL À ENCAISSER :</span>
            <span>${order.total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          ${order.notes ? `
            <hr />
            <p><strong>NOTES CUISINE :</strong> ${order.notes}</p>
          ` : ''}
          <hr />
          <p class="center" style="font-size: 10px;">Préparé avec passion chez Burger & Co</p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const handleWhatsAppCustomer = (order: Order) => {
    let msg = `Bonjour ${order.customerName} ! C'est l'équipe de *Burger & Co*.\n\n`;
    if (order.status === 'pending') {
      msg += `Nous avons bien reçu votre commande *#${order.id}* d'un montant de *${order.total.toLocaleString('fr-FR')} FCFA* et nous la confirmons !`;
    } else if (order.status === 'preparing') {
      msg += `Votre commande *#${order.id}* est actuellement en cours de préparation en cuisine ! 👨‍🍳🔥`;
    } else if (order.status === 'delivering') {
      msg += `Bonne nouvelle ! Votre commande *#${order.id}* est ${order.orderType === 'delivery' ? 'en cours de livraison avec notre coursier 🛵' : 'prête à être retirée au comptoir du restaurant 🍔'} !`;
    } else if (order.status === 'completed') {
      msg += `Votre commande *#${order.id}* a été livrée. Toute l'équipe vous souhaite un excellent appétit et vous remercie pour votre confiance !`;
    } else {
      msg += `Concernant votre commande *#${order.id}* de ${order.total.toLocaleString('fr-FR')} FCFA :`;
    }
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Création manuelle d'une commande (ex: commande prise au téléphone)
  const handleSaveManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName.trim() || !manualClientPhone.trim()) return;

    const id = generateOrderId();
    const newOrd: Order = {
      id,
      customerName: manualClientName.trim(),
      customerPhone: manualClientPhone.trim(),
      orderType: manualType,
      deliveryAddress: manualType === 'delivery' ? manualAddress.trim() : undefined,
      paymentMethod: 'cash',
      items: [
        {
          productId: 'manual-item',
          name: manualItemsText.trim() || 'Commande téléphonique',
          price: Number(manualTotal),
          quantity: 1
        }
      ],
      subtotal: Number(manualTotal),
      deliveryFee: 0,
      total: Number(manualTotal),
      status: 'preparing',
      createdAt: new Date().toISOString(),
      notes: 'Commande enregistrée manuellement par le gérant'
    };

    await createOrder(newOrd);
    setShowAddModal(false);
    setManualClientName('');
    setManualClientPhone('');
    setManualAddress('');
  };

  // Statistiques
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const deliveringOrders = orders.filter(o => o.status === 'delivering');
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const averageBasket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filtrage
  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        (order.deliveryAddress && order.deliveryAddress.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            En attente de confirmation
          </span>
        );
      case 'preparing':
        return (
          <span className="bg-amber-400/20 text-amber-400 border border-amber-400/40 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5" />
            En cuisine
          </span>
        );
      case 'delivering':
        return (
          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5" />
            En livraison / Prêt
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Terminée
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Annulée
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BANNIÈRE FLASH NOUVELLE COMMANDE */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-amber-400 rounded-xl flex items-center justify-center font-black shrink-0">
              <BellRing className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <p className="text-xs uppercase font-black tracking-widest text-black/80">
                🚨 NOUVELLE COMMANDE REÇUE EN TEMPS RÉEL !
              </p>
              <h4 className="text-base font-black">
                #{newOrderAlert.id} - {newOrderAlert.customerName} ({newOrderAlert.total.toLocaleString('fr-FR')} FCFA)
              </h4>
              <p className="text-xs font-bold opacity-90">
                {newOrderAlert.orderType === 'delivery' ? `Livraison à ${newOrderAlert.deliveryArea || ''}` : 'À emporter'} • {newOrderAlert.items.length} articles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleChangeStatus(newOrderAlert.id, 'preparing');
                setNewOrderAlert(null);
              }}
              className="px-3 py-2 bg-black text-amber-400 hover:bg-zinc-900 rounded-xl text-xs font-black transition"
            >
              Passer en cuisine
            </button>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="p-2 text-black hover:bg-black/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* HEADER & BARRE DE CONTRÔLE NOTIFICATIONS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Espace Commandes en Direct
            </h3>
            {pendingOrders.length > 0 && (
              <span className="bg-red-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full animate-pulse">
                {pendingOrders.length} NOUVELLE{pendingOrders.length > 1 ? 'S' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Visualisez instantanément les commandes passées par les clients sur le site. Les notifications sonores et visuelles alertent tous les administrateurs connectés.
          </p>
        </div>

        {/* Boutons d'actions et paramètres sonores */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Désactiver le carillon sonore' : 'Activer le carillon sonore'}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-amber-400 text-black font-black shadow-md shadow-amber-400/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Son actif' : 'Son muet'}</span>
          </button>

          <button
            type="button"
            onClick={handleTestChime}
            title="Tester le carillon audio de restaurant"
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-zinc-700"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Tester carillon</span>
          </button>

          {!hasBrowserNotification && (
            <button
              type="button"
              onClick={handleEnableNotifications}
              title="Recevoir des notifications sur votre téléphone / ordinateur"
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-750 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-zinc-700"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Activer alertes bureau</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl flex items-center gap-1.5 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Saisie manuelle</span>
          </button>
        </div>
      </div>

      {/* STATISTIQUES RAPIDES DU JOUR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block">En attente</span>
          <p className="text-2xl font-black text-red-400 mt-1">{pendingOrders.length}</p>
          <span className="text-[10px] text-zinc-500">À confirmer en cuisine</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block">En préparation</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{preparingOrders.length}</p>
          <span className="text-[10px] text-zinc-500">Burgers sur le grill</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block">Total Commandes</span>
          <p className="text-2xl font-black text-white mt-1">{orders.length}</p>
          <span className="text-[10px] text-zinc-500">{completedOrders.length} livrées avec succès</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block">Chiffre d'affaires</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs">F</span>
          </p>
          <span className="text-[10px] text-zinc-500">Panier moyen : {averageBasket.toLocaleString('fr-FR')} F</span>
        </div>
      </div>

      {/* RECHERCHE & ONGLETS DE STATUT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Onglets de filtrage */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Toutes', count: orders.length },
            { id: 'pending', label: 'En attente', count: pendingOrders.length, highlight: pendingOrders.length > 0 },
            { id: 'preparing', label: 'En cuisine', count: preparingOrders.length },
            { id: 'delivering', label: 'En livraison', count: deliveringOrders.length },
            { id: 'completed', label: 'Terminées', count: completedOrders.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-amber-400 text-black font-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterStatus === tab.id 
                  ? 'bg-black text-amber-400 font-bold' 
                  : tab.highlight 
                    ? 'bg-red-500 text-white font-black animate-pulse' 
                    : 'bg-zinc-800 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="N° commande, client, tél..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* LISTE DES COMMANDES */}
      {filteredOrders.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-base font-bold text-white">Aucune commande dans cette vue</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery ? 'Aucune commande ne correspond à votre recherche.' : 'Les nouvelles commandes s\'afficheront ici en temps réel avec notification sonore.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const timeAgoMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
            return (
              <div
                key={order.id}
                className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all shadow-lg ${
                  order.status === 'pending'
                    ? 'border-red-500/60 ring-1 ring-red-500/30'
                    : order.status === 'preparing'
                    ? 'border-amber-400/40'
                    : 'border-zinc-800'
                }`}
              >
                {/* Ligne d'en-tête de la commande */}
                <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-black text-sm px-3 py-1 rounded-xl">
                      #{order.id}
                    </div>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {timeAgoMinutes < 1 ? 'À l\'instant' : `Il y a ${timeAgoMinutes} min`} ({new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {order.orderType === 'delivery' ? '🛵 Livraison' : '🏬 À emporter'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handlePrintReceipt(order)}
                      title="Imprimer le ticket pour la cuisine ou le livreur"
                      className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span className="hidden md:inline">Imprimer ticket</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Supprimer la commande"
                      className="p-2 bg-zinc-850 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Corps de la commande */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Colonne 1 : Coordonnées Client */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Client & Coordonnées
                    </span>
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 space-y-2">
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        {order.customerName}
                      </p>
                      <p className="text-xs text-zinc-300 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`tel:${order.customerPhone}`} className="hover:underline text-amber-300">
                          {order.customerPhone}
                        </a>
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-zinc-400 flex items-start gap-2 pt-1 border-t border-zinc-900">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            {order.deliveryArea && <strong className="text-zinc-200">[{order.deliveryArea}] </strong>}
                            {order.deliveryAddress}
                          </span>
                        </p>
                      )}
                      <p className="text-[11px] text-zinc-500 pt-1">
                        Paiement : <strong className="text-zinc-300">{order.paymentMethod.toUpperCase()}</strong>
                      </p>
                    </div>

                    {/* Bouton direct WhatsApp client */}
                    <button
                      onClick={() => handleWhatsAppCustomer(order)}
                      className="w-full py-2 px-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notifier le client sur WhatsApp</span>
                    </button>
                  </div>

                  {/* Colonne 2 : Détails des articles commandés */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Articles Commandés ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 divide-y divide-zinc-900 space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                              {it.quantity}x
                            </span>
                            <div>
                              <p className="font-bold text-white">{it.name}</p>
                              {it.options && (
                                <p className="text-[10px] text-amber-300/90 italic">{it.options}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-zinc-300 font-medium whitespace-nowrap">
                            {(it.price * it.quantity).toLocaleString('fr-FR')} F
                          </span>
                        </div>
                      ))}

                      {order.deliveryFee > 0 && (
                        <div className="pt-2 flex justify-between text-xs text-zinc-400">
                          <span>Livraison ({order.deliveryArea})</span>
                          <span>{order.deliveryFee.toLocaleString('fr-FR')} F</span>
                        </div>
                      )}
                    </div>

                    {order.notes && (
                      <div className="p-2.5 bg-amber-400/5 border border-amber-400/20 rounded-xl text-xs text-amber-200">
                        <strong>Note client :</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Colonne 3 : Total & Changement rapide de statut */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Montant & Statut
                      </span>
                      <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 mt-1">
                        <span className="text-xs text-zinc-400 block">Total à encaisser</span>
                        <span className="text-2xl font-black text-amber-400">
                          {order.total.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>

                    {/* Boutons d'avancement de statut */}
                    <div className="space-y-2 pt-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleChangeStatus(order.id, 'preparing')}
                          className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-md"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>Valider & Passer en cuisine</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleChangeStatus(order.id, 'delivering')}
                          className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-md"
                        >
                          <Bike className="w-4 h-4" />
                          <span>{order.orderType === 'delivery' ? 'Prêt pour le livreur' : 'Prêt au comptoir'}</span>
                        </button>
                      )}

                      {order.status === 'delivering' && (
                        <button
                          onClick={() => handleChangeStatus(order.id, 'completed')}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Marquer Livrée / Encaissée</span>
                        </button>
                      )}

                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleChangeStatus(order.id, 'cancelled')}
                          className="w-full py-1.5 text-zinc-500 hover:text-red-400 text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
                        >
                          Annuler la commande
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <p className="text-center text-xs text-emerald-400 font-bold py-2 bg-emerald-950/40 rounded-xl border border-emerald-900/50 flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" />
                          Commande finalisée
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL AJOUT MANUEL D'UNE COMMANDE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-base font-black text-white uppercase">
                Nouvelle commande manuelle (Téléphone)
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Nom du client *</label>
                <input
                  type="text"
                  required
                  value={manualClientName}
                  onChange={(e) => setManualClientName(e.target.value)}
                  placeholder="Ex: Ibrahima Sow"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Numéro de téléphone *</label>
                <input
                  type="tel"
                  required
                  value={manualClientPhone}
                  onChange={(e) => setManualClientPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Type *</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as 'delivery' | 'takeaway')}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="delivery">Livraison</option>
                    <option value="takeaway">À emporter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Montant Total (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={manualTotal}
                    onChange={(e) => setManualTotal(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {manualType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Adresse de livraison</label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Quartier, rue, immeuble..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Articles / Détails</label>
                <textarea
                  rows={2}
                  value={manualItemsText}
                  onChange={(e) => setManualItemsText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-xs"
                >
                  Enregistrer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
