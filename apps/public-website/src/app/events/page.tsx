import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const revalidate = 15;

export default function ClubEventsPage() {
  const { clubSettings, events } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            
            <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              CLUB EVENTS & OUTREACH
            </h1>
            <p className="text-slate-300 text-base mt-1">
              Upcoming community clinics, tournaments, supporter gatherings, and trial dates.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#141414] rounded-2xl p-6 border border-[#262626] shadow-xl space-y-3"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 text-xs font-bold uppercase">
                  {ev.category}
                </span>
                <h2 className="font-athletic text-2xl font-black uppercase text-white">
                  {ev.title}
                </h2>
                <p className="text-sm text-slate-300">{ev.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-[#262626]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FDE100]" />
                    {new Date(ev.startsAt).toLocaleString('en-KE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Africa/Nairobi',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FDE100]" />
                    {ev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#141414] p-12 text-center border border-[#262626] space-y-2">
            <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="font-athletic text-2xl font-bold uppercase text-white">
              No Upcoming Club Events Published Yet
            </h2>
            <p className="text-sm text-slate-400">
              Community outreach activities, supporter meetings, and club events appear here when published in the Control Centre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
