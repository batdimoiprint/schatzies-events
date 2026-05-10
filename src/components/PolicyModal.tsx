import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function PolicyModal({ isOpen, onClose, title, children }: PolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200 ease-out">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-[#1a1225]">{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(80vh-120px)] overflow-y-auto pr-4">
          <div className="space-y-4 text-sm text-[#3d2052]">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
