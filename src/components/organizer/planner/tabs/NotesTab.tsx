import { ListChecks, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { noteTileThemes } from '@/constants/planner';
import type { PlannerQuickNote } from '@/types/planner';

interface NotesTabProps {
  isInlineNoteOpen: boolean;
  setIsInlineNoteOpen: (v: boolean) => void;
  noteDraftError: string;
  noteDraftTitle: string;
  setNoteDraftTitle: (v: string) => void;
  noteDraftBody: string;
  setNoteDraftBody: (v: string) => void;
  noteDraftImageDataUrl?: string;
  setNoteDraftImageDataUrl: (v?: string) => void;
  handleCloseInlineNote: () => void;
  handlePlannerNoteImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plannerNotes: PlannerQuickNote[];
  draggedNoteId: string | null;
  handleNoteDragStart: (e: React.DragEvent<HTMLElement>, id: string) => void;
  handleNoteDragEnd: () => void;
  handleNoteDrop: (e: React.DragEvent<HTMLElement>, targetId: string) => void;
  handleEditPlannerNote: (note: PlannerQuickNote) => void;
}

export function NotesTab({
  isInlineNoteOpen,
  setIsInlineNoteOpen,
  noteDraftError,
  noteDraftTitle,
  setNoteDraftTitle,
  noteDraftBody,
  setNoteDraftBody,
  noteDraftImageDataUrl,
  setNoteDraftImageDataUrl,
  handleCloseInlineNote,
  plannerNotes,
  draggedNoteId,
  handleNoteDragStart,
  handleNoteDragEnd,
  handleNoteDrop,
  handleEditPlannerNote,
}: NotesTabProps) {
  return (
    <section className="rounded-2xl border border-border bg-[#f6f4f7] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
      <div className="mb-8 mx-auto w-full max-w-2xl">
        {!isInlineNoteOpen ? (
          <div
            onClick={() => {
              setIsInlineNoteOpen(true);
            }}
            className="flex cursor-text items-center justify-between rounded-xl border border-border bg-white px-5 py-3.5 shadow-[0_2px_8px_rgba(27,16,45,0.04)] transition hover:shadow-md"
          >
            <span className="text-[14px] font-semibold text-[#8a8399]">Take a note...</span>
            <div className="flex gap-4 text-[#aba3b9]">
              <ListChecks className="size-5" />
              <Pencil className="size-5" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-4 shadow-lg">
            {noteDraftError && (
              <p className="px-1 mb-2 text-xs font-bold text-[#d22067]">{noteDraftError}</p>
            )}
            <Input
              value={noteDraftTitle}
              onChange={(e) => setNoteDraftTitle(e.target.value)}
              placeholder="Title"
              className="h-auto border-none bg-transparent px-1 text-[16px] font-bold text-foreground shadow-none focus-visible:ring-0 placeholder:text-[#8a8399]"
            />
            <textarea
              autoFocus
              value={noteDraftBody}
              onChange={(e) => {
                setNoteDraftBody(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Take a note..."
              className="min-h-[60px] max-h-[50vh] w-full resize-none overflow-y-auto break-words whitespace-pre-wrap px-1 bg-transparent text-[14px] leading-relaxed text-[#4d4858] outline-none placeholder:text-[#aba3b9]"
            />
            {noteDraftImageDataUrl && (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-[#e0dbe6]">
                <img
                  src={noteDraftImageDataUrl}
                  alt="Attached"
                  className="max-h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNoteDraftImageDataUrl(undefined)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
            <div className="mt-2 flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleCloseInlineNote}
                className="rounded-md px-4 py-2 text-[13px] font-bold text-foreground transition hover:bg-[#f3eff8]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {plannerNotes.map((note, index) => {
          const noteTheme = noteTileThemes[index % noteTileThemes.length];
          const isDragging = draggedNoteId === note.id;
          return (
            <article
              key={note.id}
              draggable
              onDragStart={(e) => handleNoteDragStart(e, note.id)}
              onDragEnd={handleNoteDragEnd}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => handleNoteDrop(e, note.id)}
              onClick={() => handleEditPlannerNote(note)}
              className={`break-inside-avoid relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:shadow-md ${noteTheme.shellClassName} ${isDragging ? 'opacity-30 border-dashed scale-95' : 'opacity-100'}`}
            >
              {note.imageDataUrl && (
                <img
                  src={note.imageDataUrl}
                  alt={`${note.title} attachment`}
                  className="w-full h-auto object-contain border-b border-border"
                />
              )}
              <div className="p-4 flex flex-col gap-2">
                {note.title && <p className="text-[15px] font-bold text-inherit">{note.title}</p>}
                <p
                  className={`break-words whitespace-pre-wrap text-[13px] leading-relaxed text-inherit/90`}
                >
                  {note.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
