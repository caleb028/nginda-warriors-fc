'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  FileText,
  Search,
  ShoppingBag,
  Trophy,
  User,
  X,
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Players' | 'News' | 'Fixtures' | 'Store' | 'Club';
  href: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    id: 's-1',
    title: 'Squad & First Team Directory',
    subtitle: 'Active Warriors First Team Lineup & Jersey Roster',
    category: 'Players',
    href: '/team',
  },
  {
    id: 's-2',
    title: 'Fixtures & Verified Results',
    subtitle: 'Upcoming county matches, kickoff times & match reports',
    category: 'Fixtures',
    href: '/fixtures',
  },
  {
    id: 's-3',
    title: 'League Standings Table',
    subtitle: 'Current Murang’a County League positioning & form guide',
    category: 'Fixtures',
    href: '/standings',
  },
  {
    id: 's-4',
    title: 'Warriors TV Channel',
    subtitle: 'Inside Nginda, Tunnel Cam & Match Highlights',
    category: 'Club',
    href: '/#warriors-tv',
  },
  {
    id: 's-5',
    title: 'Official Club Merchandise Store',
    subtitle: 'Green & Gold replica kits, training jackets & fan scarves',
    category: 'Store',
    href: '/merchandise',
  },
  {
    id: 's-6',
    title: 'Supporter Hub & Digital Pass',
    subtitle: 'Claim your personalized fan membership pass & vote POTM',
    category: 'Club',
    href: '/#supporters-hub',
  },
  {
    id: 's-7',
    title: 'Financial Transparency Ledger',
    subtitle: 'Audited expenditure records & verified M-PESA contributions',
    category: 'Club',
    href: '/transparency',
  },
  {
    id: 's-8',
    title: 'Partner & Sponsor Packages',
    subtitle: 'Corporate sponsorship tiers, kit branding & proposal brief',
    category: 'Club',
    href: '/sponsors',
  },
  {
    id: 's-9',
    title: 'Player Recruitment & Trials',
    subtitle: 'Submit an application to trial for Nginda Warriors FC',
    category: 'Players',
    href: '/recruitment',
  },
  {
    id: 's-10',
    title: 'Club History & Founding 2024',
    subtitle: 'Our origins in Murang’a County and long-term vision',
    category: 'Club',
    href: '/about',
  },
];

export function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DATABASE.slice(0, 6);

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'Players':
        return <User className="w-4 h-4 text-[#F5D000]" />;
      case 'Fixtures':
        return <Calendar className="w-4 h-4 text-[#F5D000]" />;
      case 'Store':
        return <ShoppingBag className="w-4 h-4 text-[#F5D000]" />;
      case 'News':
        return <FileText className="w-4 h-4 text-[#F5D000]" />;
      default:
        return <Trophy className="w-4 h-4 text-[#F5D000]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#063B25] border border-[#08783E] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#042819] border-b border-[#08783E]/40 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F5D000]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, matches, tickets, kit, club info..."
            className="flex-1 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#042819] flex items-center justify-center border border-white/10 group-hover:border-[#F5D000]">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h5 className="font-athletic text-base font-bold uppercase text-white group-hover:text-[#F5D000] transition-colors leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-xs text-white/60 line-clamp-1">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-[#F5D000]">
                  {item.category}
                </span>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-white/60 text-xs">
              No matching club items found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#042819] border-t border-[#08783E]/40 flex items-center justify-between text-[11px] text-white/50">
          <span>Tip: Press ESC to close</span>
          <span className="text-[#F5D000] font-semibold">Nginda Warriors FC Quick Navigator</span>
        </div>
      </div>
    </div>
  );
}
