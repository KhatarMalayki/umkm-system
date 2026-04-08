import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Tag, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminDiscounts from "./AdminDiscounts";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: products } = trpc.products.list.useQuery();
  const { data: orders } = trpc.orders.list.useQuery();
  const { data: discounts } = trpc.discounts.list.useQuery();

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman ini</p>
          <Button onClick={() => setLocation("/")} className="gap-2">
            Kembali ke Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Kelola toko online Anda</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Halo, {user.name}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                <p className="text-3xl font-bold text-gray-900">{products?.length || 0}</p>
              </div>
              <Package size={32} className="text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Order</p>
                <p className="text-3xl font-bold text-gray-900">{orders?.length || 0}</p>
              </div>
              <ShoppingCart size={32} className="text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Diskon Aktif</p>
                <p className="text-3xl font-bold text-gray-900">
                  {discounts?.filter(d => d.isActive === 1).length || 0}
                </p>
              </div>
              <Tag size={32} className="text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="orders">Order</TabsTrigger>
            <TabsTrigger value="discounts">Diskon</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Produk Aktif:</span>
                  <span className="font-bold text-gray-900">{products?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Order Menunggu Pembayaran:</span>
                  <span className="font-bold text-gray-900">
                    {orders?.filter(o => o.paymentStatus === "pending").length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Order Selesai:</span>
                  <span className="font-bold text-gray-900">
                    {orders?.filter(o => o.paymentStatus === "completed").length || 0}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts">
            <AdminDiscounts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
