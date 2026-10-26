'use client';

import React, { useState } from 'react';
import { ClubCrest, MerchandiseProduct } from '@nginda-warriors/shared';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export function MerchandiseCatalogClient({
  products,
  whatsappNumber,
  crestUrl,
}: {
  products: MerchandiseProduct[];
  whatsappNumber?: string;
  crestUrl?: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<MerchandiseProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotice, setOrderNotice] = useState('');

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const res = await fetch('/api/public/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'merchandise_order',
        payload: {
          productId: selectedProduct.id,
          selectedSize,
          quantity,
          customerName,
          customerPhone,
        },
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setOrderNotice(
        `Order recorded for ${quantity}x ${selectedProduct.name} (Size ${selectedSize}).`
      );
      if (whatsappNumber) {
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const text = encodeURIComponent(
          `Hello Nginda Warriors FC! I would like to order ${quantity}x ${selectedProduct.name} (Size: ${selectedSize}) — Total KES ${(
            selectedProduct.priceKes * quantity
          ).toLocaleString()}. Name: ${customerName}, Phone: ${customerPhone}`
        );
        window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
      }
      setSelectedProduct(null);
    }
  };

  return (
    <div className="space-y-8">
      {orderNotice && (
        <div className="p-4 rounded-xl bg-[#EEF7EF] border border-[#08783E] text-[#063B25] text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#08783E]" />
          <span>{orderNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-60 bg-[#063B25] flex items-center justify-center relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ClubCrest size={96} customCrestUrl={crestUrl} />
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#F5D000] text-[#063B25] font-athletic font-bold text-xs uppercase">
                  {product.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#08783E] text-white text-xs font-bold uppercase">
                  {product.stockStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                  {product.name}
                </h3>
                <p className="font-athletic text-2xl font-black text-[#08783E] mt-1">
                  KES {product.priceKes.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">{product.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.availableSizes.map((sz) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 rounded bg-[#EEF7EF] text-[#063B25] text-xs font-bold"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                disabled={product.stockStatus === 'out_of_stock'}
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize(product.availableSizes[0] || 'L');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider disabled:opacity-40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleOrder}
            className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-[#08783E] space-y-4"
          >
            <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
              Order: {selectedProduct.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white"
                >
                  {selectedProduct.availableSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-sm uppercase tracking-wider"
              >
                Confirm (KES {(selectedProduct.priceKes * quantity).toLocaleString()})
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
