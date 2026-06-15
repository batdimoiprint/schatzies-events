import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ChecklistDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  checklistDeleteTarget: { id: string; label: string } | null;
  checklistDeleteValidation: string;
  setChecklistDeleteValidation: (v: string) => void;
  checklistDeleteError: string;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ChecklistDeleteDialog({
  isOpen,
  onOpenChange,
  checklistDeleteTarget,
  checklistDeleteValidation,
  setChecklistDeleteValidation,
  checklistDeleteError,
  handleSubmit,
  onClose,
}: ChecklistDeleteDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
        onOpenChange(open);
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="fixed left-[50%] top-[50%] z-[100000] w-full max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e3dfea] bg-white p-0 shadow-2xl sm:max-w-[520px] overflow-hidden"
      >
        <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>
        <form className="px-6 py-5" onSubmit={handleSubmit}>
          <h3 className="text-[24px] font-black tracking-tight text-foreground">
            Delete checklist item?
          </h3>
          <p className="mt-2 text-sm text-[#686176]">
            This action will permanently remove the selected checklist row.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-[#faf8fc] px-3 py-2 text-sm font-semibold text-[#4f4a58]">
            {checklistDeleteTarget?.label}
          </div>
          <Label
            htmlFor="delete-checklist-validation"
            className="mt-4 block text-xs font-semibold uppercase tracking-[0.1em] text-[#7d778d]"
          >
            Type the item name to confirm
          </Label>
          <Input
            id="delete-checklist-validation"
            type="text"
            value={checklistDeleteValidation}
            onChange={(e) => {
              setChecklistDeleteValidation(e.target.value);
              if (checklistDeleteError) setChecklistDeleteValidation('');
            }}
            className="mt-2 h-10 border-border text-sm font-semibold text-[#3f3a4e]"
            placeholder={checklistDeleteTarget?.label ?? ''}
          />
          {checklistDeleteError && (
            <p className="mt-2 text-xs font-semibold text-[#d22067]">{checklistDeleteError}</p>
          )}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d7d0e2] px-3 text-xs font-bold text-[#5d5670] transition hover:bg-[#f4f1f8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#cf1f65] px-4 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(172,31,90,0.34)]"
            >
              Delete item
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
