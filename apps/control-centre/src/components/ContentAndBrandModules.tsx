'use client';

import React, { useState } from 'react';
import {
  ArticleCategoryName,
  GalleryCategory,
  HeroSlide,
  NgindaDatabaseSchema,
  PublicationStatus,
  createUuid,
} from '@nginda-warriors/shared';
import {
  Camera,
  Calendar,
  CheckCircle2,
  Edit3,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  Plus,
  Sliders,
  Trash2,
} from 'lucide-react';

const ARTICLE_CATEGORIES: ArticleCategoryName[] = [
  'Club announcements',
  'Match reports',
  'Transfers',
  'Training updates',
  'Player interviews',
  'Community stories',
  'Sponsorship announcements',
  'Official notices',
];

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Matches',
  'Training',
  'Tournaments',
  'Club events',
  'Community outreach',
  'Celebrations',
];

export function ContentAndBrandModules({
  activeModule,
  db,
  onMutate,
}: {
  activeModule: string;
  db: NgindaDatabaseSchema;
  onMutate: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  const { clubSettings } = db;

  // News CMS State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [categoryName, setCategoryName] = useState<ArticleCategoryName>('Club announcements');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('Secretariat');
  const [articleStatus, setArticleStatus] = useState<PublicationStatus>('published');

  // Media Library State
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaCategory, setMediaCategory] = useState<GalleryCategory>('Matches');
  const [mediaUrl, setMediaUrl] = useState('');
  const [externalVideoUrl, setExternalVideoUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Community Match');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('Nginda Home Ground');
  const [eventStartsAt, setEventStartsAt] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16)
  );

  // Brand Palette State
  const [warriorGreen, setWarriorGreen] = useState(clubSettings.warriorGreen || '#08783E');
  const [deepForestGreen, setDeepForestGreen] = useState(clubSettings.deepForestGreen || '#063B25');
  const [crestYellow, setCrestYellow] = useState(clubSettings.crestYellow || '#F5D000');
  const [goldenAccent, setGoldenAccent] = useState(clubSettings.goldenAccent || '#D5AA00');
  const [crestUrl, setCrestUrl] = useState(clubSettings.crestUrl || '/brand/nginda-warriors-crest.svg');

  // Club Info State
  const [aboutSummary, setAboutSummary] = useState(clubSettings.clubInfo.aboutSummary);
  const [historyNarrative, setHistoryNarrative] = useState(clubSettings.clubInfo.historyNarrative);
  const [visionStatement, setVisionStatement] = useState(clubSettings.clubInfo.visionStatement);
  const [missionStatement, setMissionStatement] = useState(clubSettings.clubInfo.missionStatement);
  const [homeGroundName, setHomeGroundName] = useState(clubSettings.clubInfo.homeGroundName || '');
  const [homeGroundDesc, setHomeGroundDesc] = useState(clubSettings.clubInfo.homeGroundDescription || '');
  const [trainingGroundName, setTrainingGroundName] = useState(clubSettings.clubInfo.trainingGroundName || '');
  const [trainingGroundDesc, setTrainingGroundDesc] = useState(clubSettings.clubInfo.trainingGroundDescription || '');
  const [communitySummary, setCommunitySummary] = useState(clubSettings.clubInfo.communityImpactSummary);

  // 1. HOMEPAGE EDITOR MODULE (Hero Slides + Sections)
  if (activeModule === 'homepage') {
    return (
      <div className="space-y-8">
        {/* Brand Tokens Quick Bar */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#08783E] font-athletic font-bold uppercase text-sm">
            <Palette className="w-5 h-5" />
            <span>Brand Palette Customizer (Centralized CSS Design Tokens)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Warrior Green
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={warriorGreen}
                  onChange={(e) => setWarriorGreen(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={warriorGreen}
                  onChange={(e) => setWarriorGreen(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Deep Forest Green
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={deepForestGreen}
                  onChange={(e) => setDeepForestGreen(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={deepForestGreen}
                  onChange={(e) => setDeepForestGreen(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Crest Yellow
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={crestYellow}
                  onChange={(e) => setCrestYellow(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={crestYellow}
                  onChange={(e) => setCrestYellow(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Golden Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={goldenAccent}
                  onChange={(e) => setGoldenAccent(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={goldenAccent}
                  onChange={(e) => setGoldenAccent(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onMutate('save_club_settings', {
                warriorGreen,
                deepForestGreen,
                crestYellow,
                goldenAccent,
              })
            }
            className="px-5 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase tracking-wider"
          >
            Update Brand Palette Tokens Live
          </button>
        </div>

        {/* Hero Slideshow Manager (Up to 5 Slides) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                Homepage Hero Slideshow ({clubSettings.heroSlides.length} / 5 Slides)
              </h3>
              <p className="text-xs text-gray-600">
                Upload genuine club photographs, edit taglines, customize call-to-actions, and reorder slides.
              </p>
            </div>
            {clubSettings.heroSlides.length < 5 && (
              <button
                type="button"
                onClick={() => {
                  const updatedSlides = [
                    ...clubSettings.heroSlides,
                    {
                      id: createUuid(),
                      headline: clubSettings.clubName,
                      tagline: 'One Team. One Community. One Warrior Spirit.',
                      description: 'United under the green and yellow badge.',
                      imageUrl: '',
                      primaryCtaLabel: 'Explore Our Club',
                      primaryCtaHref: '/about',
                      secondaryCtaLabel: 'Partner With Us',
                      secondaryCtaHref: '/sponsors',
                      isVisible: true,
                      displayOrder: clubSettings.heroSlides.length + 1,
                    },
                  ];
                  onMutate('save_club_settings', { heroSlides: updatedSlides });
                }}
                className="px-4 py-2 rounded-lg bg-[#F5D000] text-[#063B25] font-athletic font-black text-xs uppercase tracking-wider"
              >
                + Add Hero Slide
              </button>
            )}
          </div>

          <div className="space-y-4">
            {clubSettings.heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-athletic text-lg font-black uppercase text-[#08783E]">
                    Slide #{idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold flex items-center gap-1.5 text-gray-700">
                      <input
                        type="checkbox"
                        checked={slide.isVisible}
                        onChange={(e) => {
                          const updated = clubSettings.heroSlides.map((s) =>
                            s.id === slide.id ? { ...s, isVisible: e.target.checked } : s
                          );
                          onMutate('save_club_settings', { heroSlides: updated });
                        }}
                      />
                      <span>Visible</span>
                    </label>
                    {clubSettings.heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = clubSettings.heroSlides.filter((s) => s.id !== slide.id);
                          onMutate('save_club_settings', { heroSlides: updated });
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={slide.headline}
                    onChange={(e) => {
                      const updated = clubSettings.heroSlides.map((s) =>
                        s.id === slide.id ? { ...s, headline: e.target.value } : s
                      );
                      onMutate('save_club_settings', { heroSlides: updated });
                    }}
                    placeholder="Headline"
                    className="px-3 py-1.5 rounded border border-gray-300 text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={slide.tagline}
                    onChange={(e) => {
                      const updated = clubSettings.heroSlides.map((s) =>
                        s.id === slide.id ? { ...s, tagline: e.target.value } : s
                      );
                      onMutate('save_club_settings', { heroSlides: updated });
                    }}
                    placeholder="Tagline"
                    className="px-3 py-1.5 rounded border border-gray-300 text-sm"
                  />
                </div>

                <input
                  type="text"
                  value={slide.description}
                  onChange={(e) => {
                    const updated = clubSettings.heroSlides.map((s) =>
                      s.id === slide.id ? { ...s, description: e.target.value } : s
                    );
                    onMutate('save_club_settings', { heroSlides: updated });
                  }}
                  placeholder="Hero slide narrative..."
                  className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={slide.imageUrl}
                    onChange={(e) => {
                      const updated = clubSettings.heroSlides.map((s) =>
                        s.id === slide.id ? { ...s, imageUrl: e.target.value } : s
                      );
                      onMutate('save_club_settings', { heroSlides: updated });
                    }}
                    placeholder="Team Photograph URL (Optional)"
                    className="px-3 py-1.5 rounded border border-gray-300 text-xs"
                  />
                  <input
                    type="text"
                    value={slide.primaryCtaLabel}
                    onChange={(e) => {
                      const updated = clubSettings.heroSlides.map((s) =>
                        s.id === slide.id ? { ...s, primaryCtaLabel: e.target.value } : s
                      );
                      onMutate('save_club_settings', { heroSlides: updated });
                    }}
                    placeholder="Primary CTA Label"
                    className="px-3 py-1.5 rounded border border-gray-300 text-xs"
                  />
                  <input
                    type="text"
                    value={slide.secondaryCtaLabel}
                    onChange={(e) => {
                      const updated = clubSettings.heroSlides.map((s) =>
                        s.id === slide.id ? { ...s, secondaryCtaLabel: e.target.value } : s
                      );
                      onMutate('save_club_settings', { heroSlides: updated });
                    }}
                    placeholder="Secondary CTA Label"
                    className="px-3 py-1.5 rounded border border-gray-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Homepage Sections Manager (Order, Visibility, Titles) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#08783E] font-athletic font-bold uppercase text-sm">
            <LayoutTemplate className="w-5 h-5" />
            <span>Homepage Section Controls</span>
          </div>
          <div className="divide-y divide-gray-100">
            {db.websiteSections.map((sec) => (
              <div
                key={sec.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-500">
                    Key: {sec.sectionKey} • Order: #{sec.displayOrder}
                  </span>
                  <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                    {sec.title}
                  </p>
                  <p className="text-xs text-gray-600">{sec.subtitle || sec.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-[#063B25] flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={sec.isVisible}
                      onChange={(e) =>
                        onMutate('save_website_section', {
                          id: sec.id,
                          isVisible: e.target.checked,
                        })
                      }
                    />
                    <span>Visible</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newTitle = prompt('Edit Section Title:', sec.title);
                      if (newTitle) {
                        onMutate('save_website_section', { id: sec.id, title: newTitle });
                      }
                    }}
                    className="px-3 py-1 rounded bg-[#EEF7EF] text-[#08783E] text-xs font-bold uppercase"
                  >
                    Edit Title
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. CLUB INFORMATION EDITOR MODULE
  if (activeModule === 'club-info') {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onMutate('save_club_settings', {
            clubInfo: {
              ...clubSettings.clubInfo,
              aboutSummary,
              historyNarrative,
              visionStatement,
              missionStatement,
              homeGroundName,
              homeGroundDescription: homeGroundDesc,
              trainingGroundName,
              trainingGroundDescription: trainingGroundDesc,
              communityImpactSummary: communitySummary,
            },
          });
        }}
        className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-6"
      >
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-athletic text-3xl font-black uppercase text-[#063B25]">
            Club Information & Narrative Editor
          </h3>
          <p className="text-xs text-gray-600">
            Official historical facts, vision, mission, and home/training facilities published on the About page.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              About Summary *
            </label>
            <textarea
              rows={3}
              required
              value={aboutSummary}
              onChange={(e) => setAboutSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Club History Narrative (Est. 2024) *
            </label>
            <textarea
              rows={4}
              required
              value={historyNarrative}
              onChange={(e) => setHistoryNarrative(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Vision Statement *
              </label>
              <textarea
                rows={3}
                required
                value={visionStatement}
                onChange={(e) => setVisionStatement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Mission Statement *
              </label>
              <textarea
                rows={3}
                required
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Home Ground Name
              </label>
              <input
                type="text"
                value={homeGroundName}
                onChange={(e) => setHomeGroundName(e.target.value)}
                placeholder="e.g. Nginda Primary School Stadium"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
              <textarea
                rows={2}
                value={homeGroundDesc}
                onChange={(e) => setHomeGroundDesc(e.target.value)}
                placeholder="Home ground description and supporter access details..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs mt-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Training Ground Name
              </label>
              <input
                type="text"
                value={trainingGroundName}
                onChange={(e) => setTrainingGroundName(e.target.value)}
                placeholder="e.g. Nginda Training Pitch"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
              <textarea
                rows={2}
                value={trainingGroundDesc}
                onChange={(e) => setTrainingGroundDesc(e.target.value)}
                placeholder="Training schedule and facility details..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Community Impact Narrative
            </label>
            <textarea
              rows={3}
              value={communitySummary}
              onChange={(e) => setCommunitySummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider shadow"
        >
          Save & Synchronize Club Information
        </button>
      </form>
    );
  }

  // 3. NEWS CMS MODULE
  if (activeModule === 'news') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_article', {
              id: editingArticleId || undefined,
              headline,
              excerpt,
              body,
              categoryName,
              featuredImageUrl,
              authorName,
              publicationStatus: articleStatus,
            });
            setEditingArticleId(null);
            setHeadline('');
            setExcerpt('');
            setBody('');
            setFeaturedImageUrl('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
              {editingArticleId ? 'Edit Article' : 'Compose News Article / Match Report'}
            </h3>
            {editingArticleId && (
              <button
                type="button"
                onClick={() => setEditingArticleId(null)}
                className="text-xs font-bold text-red-600"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Headline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Article Headline"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Category *
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value as ArticleCategoryName)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Featured Image URL
              </label>
              <input
                type="text"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://... or /uploads/photo.jpg"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Publication Status
              </label>
              <select
                value={articleStatus}
                onChange={(e) => setArticleStatus(e.target.value as PublicationStatus)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white font-bold"
              >
                <option value="published">Published (Live to Public)</option>
                <option value="draft">Private Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Short Excerpt *
            </label>
            <input
              type="text"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief article summary..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Article Content *
            </label>
            <textarea
              rows={6}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full news story or match analysis..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider"
          >
            {editingArticleId ? 'Update Article' : 'Publish Article'}
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#063B25] text-white">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Articles in Database ({db.articles.length})
            </h4>
          </div>
          {db.articles.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {db.articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#08783E]">
                      {art.categoryName} • Status: {art.publicationStatus} • Author: {art.authorName}
                    </span>
                    <h5 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                      {art.headline}
                    </h5>
                    <p className="text-xs text-gray-600 line-clamp-1">{art.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArticleId(art.id);
                        setHeadline(art.headline);
                        setExcerpt(art.excerpt);
                        setBody(art.body);
                        setCategoryName(art.categoryName);
                        setFeaturedImageUrl(art.featuredImageUrl || '');
                        setAuthorName(art.authorName);
                        setArticleStatus(art.publicationStatus);
                      }}
                      className="p-2 rounded bg-[#EEF7EF] text-[#08783E] hover:bg-[#08783E] hover:text-white transition"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently delete article "${art.headline}"?`)) {
                          onMutate('delete_article', { id: art.id });
                        }
                      }}
                      className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500">
              No articles published yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // 4. GALLERY & MEDIA MODULE
  if (activeModule === 'gallery' || activeModule === 'media') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_media_asset', {
              title: mediaTitle,
              caption: mediaCaption,
              category: mediaCategory,
              mediaType,
              url: mediaUrl,
              externalVideoUrl: externalVideoUrl || undefined,
            });
            setMediaTitle('');
            setMediaCaption('');
            setMediaUrl('');
            setExternalVideoUrl('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Add Media Asset (Photo or Video Link)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Asset Title *
              </label>
              <input
                type="text"
                required
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder="e.g. Matchday 3 Victory Celebration"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Category
              </label>
              <select
                value={mediaCategory}
                onChange={(e) => setMediaCategory(e.target.value as GalleryCategory)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Type
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="image">Photograph (Image URL)</option>
                <option value="video">Video (YouTube / External Link)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Image URL / Thumbnail *
              </label>
              <input
                type="text"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... or /brand/nginda-warriors-crest.svg"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Optional External Video URL
              </label>
              <input
                type="url"
                value={externalVideoUrl}
                onChange={(e) => setExternalVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>

          <input
            type="text"
            value={mediaCaption}
            onChange={(e) => setMediaCaption(e.target.value)}
            placeholder="Caption or description..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
          />

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Upload / Save Media Asset
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Media Library Assets ({db.mediaAssets.length})
          </h4>
          {db.mediaAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {db.mediaAssets.map((asset) => (
                <div key={asset.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#08783E]">
                        {asset.category} • {asset.mediaType}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete media asset "${asset.title}"?`)) {
                            onMutate('delete_media_asset', { id: asset.id });
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                        title="Delete Media Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-athletic text-lg font-bold uppercase text-[#063B25]">
                      {asset.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{asset.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No media assets uploaded yet.</p>
          )}
        </div>
      </div>
    );
  }

  // 5. EVENTS MODULE
  if (activeModule === 'events') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_event', {
              title: eventTitle,
              category: eventCategory,
              description: eventDesc,
              location: eventLocation,
              startsAt: new Date(eventStartsAt).toISOString(),
              registrationRequired: false,
            });
            setEventTitle('');
            setEventDesc('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Create Club Event / Community Outreach
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Grassroots Coaching Clinic"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Category
              </label>
              <input
                type="text"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Date & Time (EAT) *
              </label>
              <input
                type="datetime-local"
                required
                value={eventStartsAt}
                onChange={(e) => setEventStartsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Event Description *
            </label>
            <textarea
              rows={3}
              required
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Publish Event
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Published Club Events ({db.events.length})
          </h4>
          {db.events.map((ev) => (
            <div key={ev.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 mb-2 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#08783E]">
                  {ev.category} • {new Date(ev.startsAt).toLocaleString('en-KE')}
                </span>
                <p className="font-athletic text-lg font-bold uppercase text-[#063B25]">
                  {ev.title}
                </p>
                <p className="text-xs text-gray-600">{ev.location} — {ev.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete event "${ev.title}"?`)) {
                    onMutate('delete_event', { id: ev.id });
                  }
                }}
                className="p-1.5 rounded text-red-600 hover:bg-red-600 hover:text-white transition shrink-0"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. WEBSITE & BRAND SETTINGS (Crest, SEO, Contact)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onMutate('save_club_settings', {
          crestUrl,
          contactEmail: clubSettings.contactEmail,
          contactPhone: clubSettings.contactPhone,
          physicalAddress: clubSettings.physicalAddress,
        });
      }}
      className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-6"
    >
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-athletic text-3xl font-black uppercase text-[#063B25]">
          Website & Club Identity Settings
        </h3>
        <p className="text-xs text-gray-600">
          Official crest asset URL, typography, and public secretariat contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Official Crest Asset URL *
          </label>
          <input
            type="text"
            required
            value={crestUrl}
            onChange={(e) => setCrestUrl(e.target.value)}
            placeholder="/brand/nginda-warriors-crest.svg or transparent CDN asset URL"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Replaces the crest across both the Public Website and the Control Centre without distortion or recolouring.
          </p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Club Physical Headquarters Address
          </label>
          <input
            type="text"
            value={clubSettings.physicalAddress}
            onChange={(e) =>
              onMutate('save_club_settings', { physicalAddress: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Secretariat Contact Phone
          </label>
          <input
            type="tel"
            value={clubSettings.contactPhone}
            onChange={(e) =>
              onMutate('save_club_settings', { contactPhone: e.target.value })
            }
            placeholder="+254 7XX XXX XXX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Secretariat Contact Email
          </label>
          <input
            type="email"
            value={clubSettings.contactEmail}
            onChange={(e) =>
              onMutate('save_club_settings', { contactEmail: e.target.value })
            }
            placeholder="info@ngindawarriorsfc.co.ke"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider"
      >
        Update Identity Settings
      </button>
    </form>
  );
}
