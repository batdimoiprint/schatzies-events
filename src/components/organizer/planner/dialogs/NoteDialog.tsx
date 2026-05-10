import { ImagePlus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface NoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  noteDraftError: string;
  noteDraftTitle: string;
  setNoteDraftTitle: (v: string) => void;
  noteDraftBody: string;
  setNoteDraftBody: (v: string) => void;
  noteDraftImageDataUrl?: string;
  handleCloseInlineNote: () => void;
  handlePlannerNoteImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingPlannerNoteId: string | null;
  handleDeletePlannerNote: (id: string) => void;
}

export function NoteDialog({
  isOpen, onOpenChange, noteDraftError, noteDraftTitle, setNoteDraftTitle,
  noteDraftBody, setNoteDraftBody, noteDraftImageDataUrl, handleCloseInlineNote,
  handlePlannerNoteImageChange, editingPlannerNoteId, handleDeletePlannerNote
}: NoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) handleCloseInlineNote(); }}>
      <DialogContent showCloseButton={false} aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-[100000] w-full max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#e3dfea] bg-white p-0 shadow-2xl sm:max-w-[600px] overflow-hidden">
        <DialogTitle className="sr-only">Note Details</DialogTitle>
        <div className="flex max-h-[85vh] flex-col bg-white">
          <div className="overflow-y-auto [scrollbar-width:none]">
            {noteDraftImageDataUrl ? (<div className="relative group bg-[#1f1f21]"><img src={noteDraftImageDataUrl} alt="Attachment" className="w-full h-auto max-h-[50vh] object-contain" /></div>) : null}
            <div className="flex flex-col gap-4 p-6">
              {noteDraftError && <p className="text-xs font-bold text-[#d22067]">{noteDraftError}</p>}
              <Input value={noteDraftTitle} onChange={(e) => setNoteDraftTitle(e.target.value)} placeholder="Title" className="h-auto border-none bg-transparent px-0 text-[22px] font-semibold text-[#202124] shadow-none focus-visible:ring-0 placeholder:text-[#8a8399]" />
              <textarea value={noteDraftBody} onChange={(e) => { setNoteDraftBody(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }} placeholder="Take a note..." className="min-h-[150px] w-full resize-none break-words whitespace-pre-wrap bg-transparent text-[15px] leading-relaxed text-[#3c4043] outline-none placeholder:text-[#5f6368]" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#f1f3f4] px-4 py-3 bg-white">
            <div className="flex items-center gap-2 text-[#5f6368]">
              <label className="cursor-pointer rounded-full p-2 hover:bg-[#f1f3f4] transition"><ImagePlus className="size-5" /><input type="file" accept="image/*" className="hidden" onChange={handlePlannerNoteImageChange} /></label>
              {editingPlannerNoteId && (<button type="button" onClick={() => { handleDeletePlannerNote(editingPlannerNoteId); onOpenChange(false); }} className="cursor-pointer rounded-full p-2 hover:bg-[#ffeef5] hover:text-[#d22067] transition" aria-label="Delete note"><Trash2 className="size-5" /></button>)}
            </div>
            <button type="button" onClick={handleCloseInlineNote} className="rounded-md px-6 py-2 text-[14px] font-semibold text-[#3c4043] hover:bg-[#f1f3f4] transition">Close</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}