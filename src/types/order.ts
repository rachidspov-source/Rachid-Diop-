export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'takeaway';
export type PaymentMethod = 'wave' | 'orange_money' | 'cash';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  options?: string;
}

export interface Order {
  id: string; // e.g. "BC-8392"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryArea?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt?: string;
  notes?: string;
  adminNotes?: string;
}

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
  quantity: number;
  instructions?: string;
}
