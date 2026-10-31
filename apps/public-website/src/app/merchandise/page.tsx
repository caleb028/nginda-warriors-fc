import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { MerchandiseCatalogClient } from '../../components/MerchandiseCatalogClient';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MerchandiseStorePage() {
  const { clubSettings, products } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#070C09] text-white py-12 border-b border-[#1E2B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/20 border border-[#08783E]/40 text-[#4ADE80] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL CLUB STORE • WEAR THE COLOURS
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              WARRIORS MERCHANDISE
            </h1>
            <p className="text-slate-300 text-base mt-1">
              Official replica jerseys, scarves, caps, and training shirts with direct WhatsApp ordering.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0F0D] border border-[#1E2B23] shadow-md flex items-center justify-center">
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
          <div className="rounded-2xl bg-[#0D1410] p-12 text-center border-2 border-dashed border-[#1E2B23] space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white">
              Official Merchandise Drop Coming Soon
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Official Nginda Warriors FC jerseys, scarves, caps, and training apparel appear here once published in the Control Centre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
