import { Order, OrderStatus } from '../types/order';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const STORAGE_ORDERS_KEY = 'burger_and_co_orders_v1';
const BROADCAST_CHANNEL_NAME = 'burger_and_co_orders_channel';

// Exemples de commandes initiales pour illustrer l'espace admin
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'BC-7814',
    customerName: 'Aïssatou Diallo',
    customerPhone: '+221 77 412 88 90',
    orderType: 'delivery',
    deliveryAddress: 'Almadies, près de l’Hôtel King Fahd, Villa 45B',
    deliveryArea: 'Almadies',
    paymentMethod: 'wave',
    items: [
      {
        productId: 'smash-signature',
        name: 'Smash Burger Signature',
        price: 5500,
        quantity: 2,
        imageUrl: '/images/burger_signature.jpg',
        options: 'Sauce piquante maison en supplément'
      },
      {
        productId: 'loaded-fries',
        name: 'Loaded Fries Cheesy Bacon',
        price: 3500,
        quantity: 1,
        imageUrl: '/images/loaded_fries.jpg'
      },
      {
        productId: 'jus-naturels',
        name: 'Jus Maison Bissap / Bouye',
        price: 1500,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
        options: '1 Bissap glacé, 1 Bouye'
      }
    ],
    subtotal: 17500,
    deliveryFee: 1500,
    total: 19000,
    status: 'pending',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    notes: 'Sonner au portail noir, livrer chaud svp'
  },
  {
    id: 'BC-7813',
    customerName: 'Mamadou Ndiaye',
    customerPhone: '+221 78 650 33 21',
    orderType: 'takeaway',
    paymentMethod: 'orange_money',
    items: [
      {
        productId: 'menu-duo',
        name: 'Menu Duo Burger & Co',
        price: 12500,
        quantity: 1,
        imageUrl: '/images/menu_duo.jpg',
        options: '2 Smash Burgers, 2 Frites classiques, Coca & Sprite'
      },
      {
        productId: 'milkshake-oreo',
        name: 'Milkshake Crème & Oreo',
        price: 3000,
        quantity: 1,
        imageUrl: '/images/milkshake_oreo.jpg'
      }
    ],
    subtotal: 15500,
    deliveryFee: 0,
    total: 15500,
    status: 'preparing',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    notes: 'Je passe récupérer au comptoir à 20h'
  },
  {
    id: 'BC-7810',
    customerName: 'Fatou Binetou Seck',
    customerPhone: '+221 76 190 44 55',
    orderType: 'delivery',
    deliveryAddress: 'Mermoz Pyrotechnie, en face Clinique Madeleine',
    deliveryArea: 'Mermoz',
    paymentMethod: 'cash',
    items: [
      {
        productId: 'assiette-kafta',
        name: 'Assiette Kafta Grillée',
        price: 7500,
        quantity: 1,
        imageUrl: '/images/assiette_kafta.jpg'
      },
      {
        productId: 'double-cheese',
        name: 'Double Cheeseburger Bacon',
        price: 6500,
        quantity: 1,
        imageUrl: '/images/double_cheeseburger.jpg'
      }
    ],
    subtotal: 14000,
    deliveryFee: 1500,
    total: 15500,
    status: 'completed',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString()
  }
];

// Gestion BroadcastChannel multi-onglets
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Ignorer si non supporté
}

export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local orders:', e);
  }
  // Initialise avec des exemples si vide
  saveLocalOrders(SAMPLE_INITIAL_ORDERS);
  return SAMPLE_INITIAL_ORDERS;
}

export function saveLocalOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ORDERS_UPDATED', orders });
    }
  } catch (e) {
    console.error('Error saving local orders:', e);
  }
}

/**
 * Génère un identifiant de commande convivial (ex: BC-4921)
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BC-${randomNum}`;
}

/**
 * Crée et enregistre une nouvelle commande
 */
export async function createOrder(order: Order): Promise<Order> {
  const currentOrders = getLocalOrders();
  const updatedOrders = [order, ...currentOrders.filter(o => o.id !== order.id)];
  saveLocalOrders(updatedOrders);

  // Synchronisation Firestore si configuré
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, order);
    } catch (err) {
      console.warn('Firestore order save fallback to local:', err);
    }
  }

  // Notifier le canal de broadcast pour les administrateurs
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_ORDER_CREATED', order });
  }

  return order;
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string): Promise<void> {
  const orders = getLocalOrders();
  const updated = orders.map(o => {
    if (o.id === orderId) {
      return {
        ...o,
        status,
        updatedAt: new Date().toISOString(),
        ...(adminNotes !== undefined ? { adminNotes } : {})
      };
    }
    return o;
  });
  saveLocalOrders(updated);

  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString(),
        ...(adminNotes !== undefined ? { adminNotes } : {})
      });
    } catch (err) {
      console.warn('Firestore update order status fallback:', err);
    }
  }
}

/**
 * Supprime une commande
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const orders = getLocalOrders();
  const updated = orders.filter(o => o.id !== orderId);
  saveLocalOrders(updated);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.warn('Firestore delete order fallback:', err);
    }
  }
}

/**
 * Écoute les commandes en temps réel (Firestore + BroadcastChannel + LocalStorage)
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[], newlyCreatedOrder?: Order) => void
): () => void {
  let isSubscribed = true;

  // 1. Écoute Firestore si actif
  let unsubscribeFirestore: (() => void) | null = null;
  if (isFirebaseConfigured && db) {
    try {
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, orderBy('createdAt', 'desc'));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!isSubscribed) return;
          const cloudOrders: Order[] = [];
          snapshot.forEach((doc) => {
            cloudOrders.push(doc.data() as Order);
          });
          if (cloudOrders.length > 0) {
            saveLocalOrders(cloudOrders);
            onUpdate(cloudOrders);
          }
        },
        (error) => {
          console.warn('Firestore orders snapshot listener error, using local:', error);
        }
      );
    } catch (e) {
      console.warn('Firestore snapshot setup error:', e);
    }
  }

  // 2. Écoute BroadcastChannel pour synchroniser instantanément tous les onglets du même navigateur
  const handleBroadcastMessage = (event: MessageEvent) => {
    if (!isSubscribed) return;
    if (event.data?.type === 'NEW_ORDER_CREATED') {
      const newOrder = event.data.order as Order;
      const latestOrders = getLocalOrders();
      onUpdate(latestOrders, newOrder);
    } else if (event.data?.type === 'ORDERS_UPDATED') {
      onUpdate(event.data.orders);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // 3. Écoute événement Storage
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_ORDERS_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          onUpdate(parsed);
        }
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // Fournir l'état actuel immédiatement
  onUpdate(getLocalOrders());

  return () => {
    isSubscribed = false;
    if (unsubscribeFirestore) unsubscribeFirestore();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}
