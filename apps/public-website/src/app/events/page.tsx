import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ClubEventsPage() {
  const { clubSettings, events } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              COMMUNITY & CLUB CALENDAR
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              CLUB EVENTS & OUTREACH
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Upcoming community clinics, tournaments, supporter gatherings, and trial dates.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
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
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] text-xs font-bold uppercase">
                  {ev.category}
                </span>
                <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
                  {ev.title}
                </h2>
                <p className="text-sm text-slate-600">{ev.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#08783E]" />
                    {new Date(ev.startsAt).toLocaleString('en-KE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Africa/Nairobi',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#08783E]" />
                    {ev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-12 text-center border border-slate-200 space-y-2">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
              No Upcoming Club Events Published Yet
            </h2>
            <p className="text-sm text-slate-500">
              Community outreach activities, supporter meetings, and club events appear here when published in the Control Centre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
