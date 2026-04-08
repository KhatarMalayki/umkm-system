import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Printer, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Invoice() {
  const [match, params] = useRoute("/invoice/:orderNumber");
  const [, setLocation] = useLocation();
  const [isPrinting, setIsPrinting] = useState(false);

  const orderNumber = match ? (params as any)?.orderNumber : null;

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    toast.info("Fitur download akan segera tersedia");
  };

  if (!match) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 print:border-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isPrinting}
              className="gap-2"
            >
              <Printer size={18} />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download size={18} />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 print:shadow-none print:border-0">
          {/* Success Message */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 print:hidden">
            <Check size={24} className="text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Pesanan Berhasil Dibuat!</p>
              <p className="text-sm text-green-700">Nomor pesanan Anda: <strong>{orderNumber}</strong></p>
            </div>
          </div>

          {/* Invoice Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-gray-600 mt-1">Nomor Pesanan: <strong>{orderNumber}</strong></p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Tanggal: <strong>{new Date().toLocaleDateString("id-ID")}</strong></p>
                <p className="text-gray-600 mt-1">Waktu: <strong>{new Date().toLocaleTimeString("id-ID")}</strong></p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Store & Buyer Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dari:</h3>
                <p className="font-bold text-lg text-gray-900">UMKM Store</p>
                <p className="text-gray-600 text-sm">Toko Online Terpercaya</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kepada:</h3>
                <p className="font-bold text-gray-900">Nama Pembeli</p>
                <p className="text-gray-600 text-sm">Telepon: [Nomor Telepon]</p>
                <p className="text-gray-600 text-sm">Email: [Email]</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 font-semibold text-gray-900">Produk</th>
                    <th className="text-center py-2 font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-2 font-semibold text-gray-900">Harga Satuan</th>
                    <th className="text-right py-2 font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Contoh Produk</td>
                    <td className="text-center py-3">1</td>
                    <td className="text-right py-3">Rp 50.000</td>
                    <td className="text-right py-3">Rp 50.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Separator className="my-6" />

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Subtotal:</span>
                  <span>Rp 50.000</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Diskon:</span>
                  <span>Rp 0</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold text-lg text-gray-900">
                  <span>Total:</span>
                  <span>Rp 50.000</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Metode Pembayaran:</strong> Bayar di Tempat (COD)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Status:</strong> <span className="text-yellow-600 font-semibold">Menunggu Pembayaran</span>
              </p>
            </div>

            {/* Notes */}
            <div className="text-sm text-gray-600 text-center">
              <p>Terima kasih telah berbelanja di UMKM Store!</p>
              <p className="mt-2">Jika ada pertanyaan, hubungi kami melalui telepon atau email.</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
