import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CartItem, Service } from "@shared/schema";

interface CartItemWithService extends CartItem {
  service?: Service;
}

interface CartContextType {
  items: CartItemWithService[];
  isLoading: boolean;
  addToCart: (serviceId: string, qty?: number) => Promise<void>;
  updateQuantity: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  gst: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GST_RATE = 0.18;

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(getOrCreateSessionId);

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithService[]>({
    queryKey: ["/api/cart", sessionId],
  });

  const addMutation = useMutation({
    mutationFn: async ({ serviceId, qty = 1 }: { serviceId: string; qty?: number }) => {
      await apiRequest("POST", "/api/cart", { sessionId, serviceId, qty });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: string; qty: number }) => {
      await apiRequest("PATCH", `/api/cart/${itemId}`, { qty });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart/clear", { sessionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    if (item.service) {
      return sum + parseFloat(item.service.basePriceInr) * item.qty;
    }
    return sum;
  }, 0);

  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        isLoading,
        addToCart: (serviceId, qty) => addMutation.mutateAsync({ serviceId, qty }),
        updateQuantity: (itemId, qty) => updateMutation.mutateAsync({ itemId, qty }),
        removeItem: (itemId) => removeMutation.mutateAsync(itemId),
        clearCart: () => clearMutation.mutateAsync(),
        subtotal,
        gst,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
