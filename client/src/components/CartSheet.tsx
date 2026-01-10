import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Package,
    ArrowRight,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CartSheet() {
    const [, setLocation] = useLocation();
    const [open, setOpen] = useState(false);
    const {
        items,
        isLoading,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        gst,
        total,
        itemCount,
        isRemovingFromCart,
    } = useCart();

    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    const handleUpdateQuantity = async (itemId: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdatingItemId(itemId);
        try {
            await updateQuantity(itemId, newQty);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        setRemovingItemId(itemId);
        try {
            await removeItem(itemId);
        } finally {
            setRemovingItemId(null);
        }
    };

    const handleCheckout = () => {
        setOpen(false);
        setLocation("/checkout");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {itemCount > 9 ? "9+" : itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader className="space-y-1 pb-4">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <ShoppingBag className="h-5 w-5" />
                        Your Cart
                        {itemCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Add services to your cart to get started
                        </p>
                        <Button onClick={() => { setOpen(false); setLocation("/services"); }}>
                            Browse Services
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Package className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
                                                {item.service?.name || "Service"}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {formatPrice(parseFloat(item.service?.basePriceInr || "0"))}
                                            </p>

                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-r-none"
                                                        onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                                                        disabled={item.qty <= 1 || updatingItemId === item.id}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <div className="w-10 text-center text-sm font-medium">
                                                        {updatingItemId === item.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                                                        ) : (
                                                            item.qty
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-l-none"
                                                        onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                                                        disabled={updatingItemId === item.id}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removingItemId === item.id}
                                                >
                                                    {removingItemId === item.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">
                                                {formatPrice(parseFloat(item.service?.basePriceInr || "0") * item.qty)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-4 space-y-4">
                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">GST (18%)</span>
                                    <span>{formatPrice(gst)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <SheetFooter className="flex-col gap-2 sm:flex-col">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Clear Cart
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will remove all items from your cart. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={async () => {
                                                    await clearCart();
                                                }}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Clear Cart
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
