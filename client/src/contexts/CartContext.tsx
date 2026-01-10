import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
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
  const { toast } = useToast();

  // Fetch cart items - use sessionId in URL path
  const { data: rawCartItems = [], isLoading } = useQuery<CartItemWithService[]>({
    queryKey: ["/api/cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${sessionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      return response.json();
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Filter out invalid cart items (missing service data)
  const cartItems = rawCartItems.filter(item => item.service && item.service.basePriceInr);

  const addMutation = useMutation({
    mutationFn: async ({ serviceId, qty = 1 }: { serviceId: string; qty?: number }) => {
      const response = await apiRequest("POST", "/api/cart", { sessionId, serviceId, qty });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Added to Cart",
        description: "Service has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add to cart",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: string; qty: number }) => {
      await apiRequest("PATCH", `/api/cart/${itemId}`, { qty });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update quantity",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove item");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove item",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to clear cart",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
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
        addToCart: async (serviceId, qty) => { await addMutation.mutateAsync({ serviceId, qty }); },
        updateQuantity: async (itemId, qty) => { await updateMutation.mutateAsync({ itemId, qty }); },
        removeItem: async (itemId) => { await removeMutation.mutateAsync(itemId); },
        clearCart: async () => { await clearMutation.mutateAsync(); },
        subtotal,
        gst,
        total,
        itemCount,
        isAddingToCart: addMutation.isPending,
        isRemovingFromCart: removeMutation.isPending,
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
