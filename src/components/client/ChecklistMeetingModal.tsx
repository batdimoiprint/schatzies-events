import { X, CheckCircle2, Circle } from 'lucide-react';

export interface MeetingItem {
  title?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
}

export interface ChecklistItem {
  label?: string;
  done?: boolean;
}

interface Props {
  onClose: () => void;
  meetings?: MeetingItem[];
  checklist?: ChecklistItem[];
}

export function ChecklistMeetingModal({ onClose, meetings = [], checklist = [] }: Props) {
  const hasData = meetings.length > 0 || checklist.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Checklist &amp; Meeting</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white transition hover:opacity-70"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm italic text-gray-400">No meetings or checklist items yet.</p>
            </div>
          ) : (
            <>
              {/* Meetings card */}
              {meetings.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-gray-800">Meetings</h3>
                  <div className="flex flex-col gap-3">
                    {meetings.map((meeting, i) => (
                      <div key={i}>
                        <p className="text-sm text-gray-800">{meeting.title}</p>
                        <p className="text-xs text-gray-400">
                          {meeting.startTime || meeting.time || ''}{' '}
                          {meeting.endTime ? `- ${meeting.endTime}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checked card */}
              {checklist.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-gray-800">Checklist</h3>
                  <ul className="flex flex-col gap-2">
                    {checklist.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        {item.done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-pink-500" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-gray-300" />
                        )}
                        <span className={item.done ? 'text-gray-800' : 'text-gray-400'}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
