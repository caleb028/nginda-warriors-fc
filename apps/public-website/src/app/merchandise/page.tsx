import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { MerchandiseCatalogClient } from '@/components/MerchandiseCatalogClient';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MerchandiseStorePage() {
  const { clubSettings, products } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL CLUB STORE • WEAR THE COLOURS
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              WARRIORS MERCHANDISE
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Official replica jerseys, scarves, caps, and training shirts with direct WhatsApp ordering.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <MerchandiseCatalogClient
            products={products}
            whatsappNumber={clubSettings.whatsappNumber || clubSettings.contactPhone}
            crestUrl={clubSettings.crestUrl}
          />
        ) : (
          <div className="rounded-2xl bg-slate-50 p-12 text-center border-2 border-dashed border-slate-300 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-800">
              Official Merchandise Drop Coming Soon
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Official Nginda Warriors FC jerseys, scarves, caps, and training apparel appear here once published in the Control Centre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
