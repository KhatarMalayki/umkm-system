import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { trpc } from "@/lib/trpc";
import { Cart, addToCart, getCart } from "@/lib/cart";
import { toast } from "sonner";

export default function Home() {
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products, isLoading } = trpc.products.list.useQuery();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);
  }, []);

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories
  const categories = Array.from(
    new Set(products?.map((p) => p.category).filter(Boolean))
  );

  const handleAddToCart = (productId: number, quantity: number) => {
    const product = products?.find((p) => p.id === productId);
    if (!product) return;

    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.price.toString()),
      quantity,
      unit: product.unit,
      imageUrl: product.imageUrl || undefined,
      discount: product.discount ? {
        discountType: product.discount.discountType as string,
        discountValue: typeof product.discount.discountValue === 'string' 
          ? parseFloat(product.discount.discountValue) 
          : product.discount.discountValue,
      } : undefined,
    };

    const updatedCart = addToCart(cartItem);
    setCart(updatedCart);
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">UMKM Store</h1>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingCart size={24} className="text-gray-700" />
            {cart.items.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Selamat Datang di UMKM Store</h2>
          <p className="text-lg text-gray-600 mb-8">
            Temukan produk berkualitas dari UMKM lokal dengan harga terbaik
          </p>

          {/* Search & Filter */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Semua
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat produk...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Tidak ada produk yang ditemukan</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={parseFloat(product.price.toString())}
                unit={product.unit}
                stock={product.stock}
                imageUrl={product.imageUrl || undefined}
                category={product.category || undefined}
                discount={product.discount ? {
                  discountType: product.discount.discountType as string,
                  discountValue: typeof product.discount.discountValue === 'string'
                    ? parseFloat(product.discount.discountValue)
                    : product.discount.discountValue,
                } : undefined}
                onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} cart={cart} onCartUpdate={setCart} />
    </div>
  );
}
