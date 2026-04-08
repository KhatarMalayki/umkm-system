import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { useState } from "react";
import { calculatePriceAfterDiscount } from "@/lib/cart";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  category?: string;
  discount?: {
    discountType: string;
    discountValue: number;
  };
  onAddToCart: (quantity: number) => void;
}

// Helper untuk konversi desimal ke pecahan
const decimalToFraction = (decimal: number): string => {
  if (decimal === 0.25) return "1/4";
  if (decimal === 0.5) return "1/2";
  if (decimal === 0.75) return "3/4";
  if (decimal === 1) return "1";
  if (decimal === 1.5) return "1 1/2";
  if (decimal === 2) return "2";
  return decimal.toString();
};

// Helper untuk konversi pecahan string ke desimal
const fractionToDecimal = (fraction: string): number => {
  const fractionMap: Record<string, number> = {
    "1/4": 0.25,
    "1/2": 0.5,
    "3/4": 0.75,
    "1": 1,
    "1 1/2": 1.5,
    "2": 2,
  };
  return fractionMap[fraction] || parseFloat(fraction);
};

export default function ProductCard({
  id,
  name,
  price,
  unit,
  stock,
  imageUrl,
  category,
  discount,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Preset options untuk satuan tertentu
  const getPresetOptions = () => {
    if (unit === "Kg" || unit === "Liter") {
      return [
        { decimal: 0.25, label: "1/4" },
        { decimal: 0.5, label: "1/2" },
        { decimal: 0.75, label: "3/4" },
        { decimal: 1, label: "1" },
        { decimal: 1.5, label: "1 1/2" },
        { decimal: 2, label: "2" },
      ];
    }
    return [];
  };

  const presetOptions = getPresetOptions();
  const hasPresets = presetOptions.length > 0;

  const priceAfterDiscount = calculatePriceAfterDiscount(price, discount);
  const discountPercentage =
    discount && discount.discountType === "percentage" ? discount.discountValue : 0;
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(quantity);
    setQuantity(1);
    setShowPresets(false);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handlePresetSelect = (value: number) => {
    setQuantity(value);
    setShowPresets(false);
  };

  const getDisplayQuantity = () => {
    return decimalToFraction(quantity);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Stok Habis</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</span>
        )}

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">{name}</h3>

        {/* Price */}
        <div className="mb-3">
          {discount && priceAfterDiscount < price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                Rp {priceAfterDiscount.toLocaleString("id-ID")}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rp {price.toLocaleString("id-ID")}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              Rp {price.toLocaleString("id-ID")}
            </span>
          )}
          <span className="text-xs text-gray-500">per {unit}</span>
        </div>

        {/* Stock Info */}
        <div className="mb-4 flex items-center gap-1">
          {stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">Stok: {stock}</span>
          ) : (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={14} />
              <span>Stok Habis</span>
            </div>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="mt-auto space-y-2">
          {/* Preset Options untuk Kg/Liter */}
          {hasPresets && (
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                disabled={isOutOfStock}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-left font-medium"
              >
                {getDisplayQuantity()} {unit}
              </button>

              {/* Dropdown Presets */}
              {showPresets && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {presetOptions.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePresetSelect(preset.decimal)}
                        className={`px-2 py-1 text-xs rounded transition-colors font-medium ${
                          quantity === preset.decimal
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0.01, parseFloat(e.target.value) || 1))}
                      disabled={isOutOfStock}
                      placeholder="Atau input manual"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standard Quantity Controls untuk satuan lain */}
          {!hasPresets && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isOutOfStock}
                className="w-12 text-center border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutOfStock}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="w-full gap-2"
            variant={isOutOfStock ? "outline" : "default"}
          >
            <ShoppingCart size={16} />
            {isAdding ? "Ditambahkan!" : "Tambah ke Keranjang"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
