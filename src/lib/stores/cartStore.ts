import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { CartItem } from "@/lib/types/cart";
import { calculateTotalPrice } from "@/lib/utils/priceCalculator";

interface CartState {
  items: CartItem[];
  isModalOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openModal: () => void;
  closeModal: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

type CartStore = CartState & CartActions;

const generateCartItemId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      items: [],
      isModalOpen: false,

      addItem: (item) => {
        const id = generateCartItemId();

        set((state) => {
          const newItem: CartItem = {
            id,
            ...item,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const totalPrice = calculateTotalPrice(
                item.menuItem,
                item.selectedOptions,
                quantity
              );
              return { ...item, quantity, totalPrice };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openModal: () => {
        set({ isModalOpen: true });
      },

      closeModal: () => {
        set({ isModalOpen: false });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-store",
    }
  )
);
