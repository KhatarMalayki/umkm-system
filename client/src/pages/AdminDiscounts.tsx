import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDiscounts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
  });

  const { data: products } = trpc.products.list.useQuery();
  const { data: discounts, refetch } = trpc.discounts.list.useQuery();
  const createMutation = trpc.discounts.create.useMutation();
  const updateMutation = trpc.discounts.update.useMutation();
  const deleteMutation = trpc.discounts.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      const data = {
        productId: parseInt(formData.productId),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        isActive: 1,
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast.success("Diskon berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Diskon berhasil ditambahkan");
      }

      setFormData({
        productId: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
      });
      setIsFormOpen(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Gagal menyimpan diskon");
    }
  };

  const handleEdit = (discount: any) => {
    setFormData({
      productId: discount.productId.toString(),
      discountType: discount.discountType,
      discountValue: discount.discountValue.toString(),
      startDate: new Date(discount.startDate).toISOString().split("T")[0],
      endDate: new Date(discount.endDate).toISOString().split("T")[0],
    });
    setEditingId(discount.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus diskon ini?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Diskon berhasil dihapus");
      refetch();
    } catch (error) {
      toast.error("Gagal menghapus diskon");
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      productId: "",
      discountType: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
    });
  };

  const getProductName = (productId: number) => {
    return products?.find(p => p.id === productId)?.name || "Produk tidak ditemukan";
  };

  return (
    <div className="space-y-6">
      {/* Add Discount Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manajemen Diskon</h2>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus size={18} />
            Tambah Diskon
          </Button>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? "Edit Diskon" : "Tambah Diskon Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Pilih Produk</option>
                  {products?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Diskon *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal (Rp)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai Diskon *
                </label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === "percentage" ? "Contoh: 10" : "Contoh: 5000"}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Akhir *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Perbarui" : "Tambahkan"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Discounts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Produk</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Tipe</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Nilai</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Periode</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discounts && discounts.length > 0 ? (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {getProductName(discount.productId)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {discount.discountType === "percentage" ? "Persentase" : "Nominal"}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {discount.discountType === "percentage"
                        ? `${discount.discountValue}%`
                        : `Rp ${parseFloat(discount.discountValue.toString()).toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(discount.startDate).toLocaleDateString("id-ID")} -{" "}
                      {new Date(discount.endDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada diskon
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
