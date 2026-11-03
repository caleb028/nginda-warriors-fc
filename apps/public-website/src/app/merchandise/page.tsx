import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { MerchandiseCatalogClient } from '../../components/MerchandiseCatalogClient';
import { ShoppingBag } from 'lucide-react';

export const revalidate = 15;

export default function MerchandiseStorePage() {
  const { clubSettings, products } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-wide text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FDE100]">
              Official Club Store
            </span>
            <h1 className="font-athletic text-4xl sm:text-6xl font-black uppercase text-white mt-1">
              NGINDA WARRIORS OFFICIAL STORE
            </h1>
            <p className="font-wide text-sm sm:text-base text-slate-300 mt-2">
              Introducing our official kits and merchandise for the 2026/27 season.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
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
          <div className="rounded-2xl bg-[#141414] p-12 text-center border-2 border-dashed border-[#262626] space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="font-athletic text-3xl font-black uppercase text-white">
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
