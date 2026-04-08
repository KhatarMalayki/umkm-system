import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminOrders() {
  const { data: orders, refetch } = trpc.orders.list.useQuery();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  const handleUpdateStatus = async (orderId: number, newStatus: "completed" | "failed") => {
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        paymentStatus: newStatus,
      });
      toast.success("Status order berhasil diperbarui");
      refetch();
    } catch (error) {
      toast.error("Gagal memperbarui status order");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Menunggu Pembayaran</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Selesai</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Gagal</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    return method === "COD" ? "Bayar di Tempat" : "Transfer Bank";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Daftar Order</h2>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">No. Order</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Pembeli</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Metode Pembayaran</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Total</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.buyerName}</p>
                        <p className="text-xs text-gray-500">{order.buyerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      Rp {parseFloat(order.finalAmount.toString()).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      {order.paymentStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(order.id, "completed")}
                            disabled={updateStatusMutation.isPending}
                            className="text-xs"
                          >
                            Konfirmasi
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(order.id, "failed")}
                            disabled={updateStatusMutation.isPending}
                            className="text-xs text-red-600"
                          >
                            Tolak
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
