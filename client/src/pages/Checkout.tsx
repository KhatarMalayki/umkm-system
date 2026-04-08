import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Cart, getCart, clearCart } from "@/lib/cart";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type PaymentMethod = "COD" | "TRANSFER";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 });
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation();

  useEffect(() => {
    const savedCart = getCart();
    if (savedCart.items.length === 0) {
      setLocation("/");
      return;
    }
    setCart(savedCart);
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      toast.error("Nama pembeli harus diisi");
      return;
    }

    if (!buyerPhone.trim()) {
      toast.error("Nomor telepon harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const orderData = {
        orderNumber,
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
        paymentStatus: "pending",
        totalAmount: cart.totalAmount,
        discountAmount: cart.discountAmount,
        finalAmount: cart.finalAmount,
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: item.price,
          subtotal: item.price * item.quantity,
        })),
      };

      const result = await createOrderMutation.mutateAsync(orderData);

      if (result) {
        clearCart();
        setLocation(`/invoice/${orderNumber}`);
        toast.success("Order berhasil dibuat!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Gagal membuat order. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Pembeli</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <Input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Masukkan email (opsional)"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <Input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>

                <Separator className="my-6" />

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Metode Pembayaran *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: paymentMethod === "COD" ? "#2563eb" : undefined,
                        backgroundColor: paymentMethod === "COD" ? "#eff6ff" : undefined
                      }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Bayar di Tempat (COD)</p>
                        <p className="text-sm text-gray-500">Bayar saat barang diterima</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: paymentMethod === "TRANSFER" ? "#2563eb" : undefined,
                        backgroundColor: paymentMethod === "TRANSFER" ? "#eff6ff" : undefined
                      }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="TRANSFER"
                        checked={paymentMethod === "TRANSFER"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Transfer Bank</p>
                        <p className="text-sm text-gray-500">Transfer sebelum barang dikirim</p>
                      </div>
                    </label>
                  </div>
                </div>

                <Separator className="my-6" />

                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Lanjutkan ke Invoice"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-gray-500">{item.quantity} {item.unit}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>Rp {cart.totalAmount.toLocaleString("id-ID")}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon:</span>
                    <span>-Rp {cart.discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>Rp {cart.finalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
