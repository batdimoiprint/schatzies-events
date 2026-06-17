import { useState, useEffect } from 'react';
import { ArrowLeft, Save, RefreshCw, LayoutGrid, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { DEFAULT_SITE_CONTENT } from '@/constants/defaultContent';

interface PageSectionConfig {
  id: string;
  name: string;
  isMultilineTitle?: boolean;
}

interface PageConfig {
  id: string;
  name: string;
  description: string;
  sections: PageSectionConfig[];
}

const PAGES_CONFIG: PageConfig[] = [
  {
    id: 'homepage',
    name: 'Homepage',
    description: 'Manage Hero banner, Spotlight text, Weddings & Debuts intros, and Testimonials header.',
    sections: [
      { id: 'hero', name: 'Hero Banner', isMultilineTitle: true },
      { id: 'spotlight', name: 'Spotlight Section', isMultilineTitle: false },
      { id: 'weddings', name: 'Weddings Intro (Services)', isMultilineTitle: false },
      { id: 'debuts', name: 'Debuts Intro (Services)', isMultilineTitle: false },
      { id: 'testimonials', name: 'Testimonials Header', isMultilineTitle: false },
    ],
  },
  {
    id: 'about-us',
    name: 'About Us',
    description: 'Manage Story Hero, Who We Are section, Why Choose intro, and the 4 key reason cards.',
    sections: [
      { id: 'hero', name: 'Story Hero Banner', isMultilineTitle: false },
      { id: 'aboutSplit', name: 'Who We Are (About Us)', isMultilineTitle: false },
      { id: 'whyChoose', name: 'Why Choose (Intro)', isMultilineTitle: false },
      { id: 'reason1', name: 'Reason Card 1 (since 2011)', isMultilineTitle: false },
      { id: 'reason2', name: 'Reason Card 2 (The Local\'s Choice)', isMultilineTitle: false },
      { id: 'reason3', name: 'Reason Card 3 (All-Inclusive Ease)', isMultilineTitle: false },
      { id: 'reason4', name: 'Reason Card 4 (Budget-Friendly Luxury)', isMultilineTitle: false },
    ],
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Manage brand name and main description statement at the bottom of all pages.',
    sections: [
      { id: 'brand', name: 'Footer Brand Info', isMultilineTitle: false },
    ],
  },
];

interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function AdminContentPage() {
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const { sections, loading, saveSection } = useContent(activePageId || 'homepage');

  // Form states for editing
  const [editStates, setEditStates] = useState<Record<string, { title: string; body: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const activePageConfig = PAGES_CONFIG.find((p) => p.id === activePageId);

  // Initialize form state when sections load or active page changes
  useEffect(() => {
    if (activePageId && !loading) {
      const initialStates: Record<string, { title: string; body: string }> = {};
      const config = PAGES_CONFIG.find((p) => p.id === activePageId);
      if (config) {
        config.sections.forEach((sec) => {
          const loaded = sections[sec.id];
          const defaults = DEFAULT_SITE_CONTENT[activePageId]?.[sec.id] || { title: '', body: '' };
          initialStates[sec.id] = {
            title: loaded?.title ?? defaults.title,
            body: loaded?.body ?? defaults.body,
          };
        });
      }
      setEditStates(initialStates);
    }
  }, [activePageId, sections, loading]);

  const handleInputChange = (sectionId: string, field: 'title' | 'body', value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePageId) return;

    setIsSaving(true);
    try {
      const config = PAGES_CONFIG.find((p) => p.id === activePageId);
      if (!config) return;

      let successCount = 0;
      for (const sec of config.sections) {
        const edited = editStates[sec.id];
        if (edited) {
          const ok = await saveSection(sec.id, edited.title, edited.body);
          if (ok) successCount++;
        }
      }

      if (successCount === config.sections.length) {
        showToast('success', 'Changes Saved', 'All sections updated successfully.');
      } else {
        showToast('error', 'Partial Save', `Saved ${successCount} out of ${config.sections.length} sections.`);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Save Failed', 'Could not save changes to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!activePageId) return;
    const initialStates: Record<string, { title: string; body: string }> = {};
    const config = PAGES_CONFIG.find((p) => p.id === activePageId);
    if (config) {
      config.sections.forEach((sec) => {
        const loaded = sections[sec.id];
        const defaults = DEFAULT_SITE_CONTENT[activePageId]?.[sec.id] || { title: '', body: '' };
        initialStates[sec.id] = {
          title: loaded?.title ?? defaults.title,
          body: loaded?.body ?? defaults.body,
        };
      });
    }
    setEditStates(initialStates);
    showToast('success', 'Reset Completed', 'Form values reset to current saved values.');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${
            toast.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-50/90 text-emerald-950'
              : 'border-rose-500/20 bg-rose-50/90 text-rose-950'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <div className="flex-1">
            <h5 className="font-heading text-sm font-bold">{toast.title}</h5>
            <p className="font-sans text-xs opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-foreground/50 hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
            {activePageId ? `Edit ${activePageConfig?.name}` : 'Site Content Management'}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            {activePageId
              ? `Update dynamic copy and section titles for the ${activePageConfig?.name} page.`
              : 'Choose a page component below to customize its text sections.'}
          </p>
        </div>
        {activePageId && (
          <button
            onClick={() => setActivePageId(null)}
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 font-ui text-xs font-semibold text-ink shadow-sm transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </button>
        )}
      </div>

      {!activePageId ? (
        /* Pages List Cards */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES_CONFIG.map((page) => (
            <div
              key={page.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/5 text-brand group-hover:bg-brand/10">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-ink">{page.name}</h3>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-4">
                  {page.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 font-ui text-[11px] font-semibold text-muted-foreground">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  {page.sections.length} editable sections
                </div>
              </div>
              <div className="mt-6 border-t border-border/60 pt-4">
                <button
                  onClick={() => setActivePageId(page.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 font-ui text-xs font-bold text-white shadow-sm transition hover:bg-brand-deep hover:shadow"
                >
                  Edit Page Content
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Editor Form */
        <form onSubmit={handleSave} className="space-y-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-white">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-brand" />
                <p className="font-ui text-xs text-muted-foreground font-semibold">Loading content...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activePageConfig?.sections.map((sec) => {
                const current = editStates[sec.id] || { title: '', body: '' };
                const defaults = DEFAULT_SITE_CONTENT[activePageId]?.[sec.id] || { title: '', body: '' };

                return (
                  <div
                    key={sec.id}
                    className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                  >
                    <div className="border-b border-border bg-muted/20 px-6 py-4">
                      <h4 className="font-heading text-base font-bold text-ink">{sec.name}</h4>
                      <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                        Section ID: <span className="font-mono text-brand">{sec.id}</span>
                      </p>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Title Field */}
                      <div className="space-y-1.5">
                        <label className="font-ui text-xs font-bold text-ink">Section Title</label>
                        {sec.isMultilineTitle ? (
                          <textarea
                            rows={3}
                            value={current.title}
                            onChange={(e) => handleInputChange(sec.id, 'title', e.target.value)}
                            placeholder={defaults.title}
                            className="w-full rounded-xl border border-input px-3.5 py-2 font-mono text-sm leading-normal shadow-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={current.title}
                            onChange={(e) => handleInputChange(sec.id, 'title', e.target.value)}
                            placeholder={defaults.title}
                            className="w-full h-11 rounded-xl border border-input px-3.5 font-sans text-sm shadow-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                          />
                        )}
                        <p className="font-sans text-[10px] text-muted-foreground leading-normal">
                          Use <span className="font-mono font-bold text-brand">*text*</span> syntax to italicize/style key words.
                        </p>
                      </div>

                      {/* Body Field */}
                      <div className="space-y-1.5">
                        <label className="font-ui text-xs font-bold text-ink">Section Body / Description</label>
                        <textarea
                          rows={4}
                          value={current.body}
                          onChange={(e) => handleInputChange(sec.id, 'body', e.target.value)}
                          placeholder={defaults.body}
                          className="w-full rounded-xl border border-input px-3.5 py-2.5 font-sans text-sm leading-relaxed shadow-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end border-t border-border pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-5 py-3 font-ui text-xs font-semibold text-ink transition hover:bg-muted disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset to Current
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-brand px-6 py-3 font-ui text-xs font-bold text-white shadow-md transition hover:bg-brand-deep disabled:opacity-50 shadow-brand/10"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
