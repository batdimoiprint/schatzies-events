import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VenueTabProps {
  venue: string;
}

export function VenueTab({ venue }: VenueTabProps) {
  const isVenueSet =
    venue && !['', '-', '–', '—', 'n/a', 'tba'].includes(venue.trim().toLowerCase());

  return (
    <section className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#eadfec] bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-black tracking-tight text-foreground">Event Venue</h3>
          <p className="text-xs font-semibold text-[#6e687d]">
            Details about the location of the event
          </p>
        </div>
      </div>

      <Card className="border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border border-l-4 border-l-[#f39c12]">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-lg text-white text-[11px] font-black bg-[#f39c12]">
              V
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#f39c12]">
                Venue Location
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {isVenueSet ? (
            <div className="flex items-start gap-4 rounded-xl border border-border bg-[#fdfaf5] p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fdecd3] text-[#f39c12]">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-foreground">{venue}</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Confirmed location for the event
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-[#fbfafd] px-5 py-8 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#f4f1f8] text-[#9f97ad]">
                <MapPin className="size-6" />
              </div>
              <p className="text-[14px] font-bold text-foreground/80">No venue assigned yet</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Update the event details to set the venue location.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
