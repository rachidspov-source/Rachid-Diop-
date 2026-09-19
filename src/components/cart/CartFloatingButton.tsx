import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from '../../types/order';

interface CartFloatingButtonProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const CartFloatingButton: React.FC<CartFloatingButtonProps> = ({
  cartItems,
  onOpenCart
}) => {
  const totalItems = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = cartItems.reduce((sum, it) => sum + (it.product.price * it.quantity), 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce">
      <button
        onClick={onOpenCart}
        className="flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-black px-5 py-3.5 rounded-2xl shadow-2xl shadow-amber-400/40 font-black text-sm transition transform hover:scale-105 cursor-pointer border-2 border-black"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-amber-400 text-[11px] font-black rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <div className="text-left leading-tight">
          <span className="block text-xs uppercase font-extrabold tracking-wider">Mon Panier</span>
          <span className="text-sm font-black">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </button>
    </div>
  );
};
