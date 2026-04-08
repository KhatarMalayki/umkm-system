import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Cart, removeFromCart, updateCartItemQuantity } from "@/lib/cart";
import { Link } from "wouter";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: Cart;
  onCartUpdate: (cart: Cart) => void;
}

export default function CartSidebar({ open, onOpenChange, cart, onCartUpdate }: CartSidebarProps) {
  const handleRemoveItem = (productId: number) => {
    const updatedCart = removeFromCart(productId);
    onCartUpdate(updatedCart);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity);
    onCartUpdate(updatedCart);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Keranjang Belanja
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Keranjang Anda kosong</p>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500">
                        Rp {item.price.toLocaleString("id-ID")} / {item.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-2 pt-2 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>Rp {(cart.totalAmount).toLocaleString("id-ID")}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon:</span>
                  <span>-Rp {cart.discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>Rp {cart.finalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button className="w-full" onClick={() => onOpenChange(false)}>
                Lanjut ke Checkout
              </Button>
            </Link>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
