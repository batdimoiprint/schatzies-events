import { Bell, AlertCircle, CalendarClock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockNotifications = [
  { id: 1, type: 'alert', message: 'System maintenance scheduled for tonight at 2 AM', time: '10 mins ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
  { id: 2, type: 'event', message: 'New event "Tech Summit 2024" requires approval', time: '1 hour ago', icon: CalendarClock, color: 'text-[#8f1fd0]', bg: 'bg-[#f0e8f5]' },
  { id: 3, type: 'message', message: 'You have 3 unanswered inquiries from yesterday', time: '5 hours ago', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 4, type: 'system', message: 'Weekly performance report is ready to download', time: '1 day ago', icon: Bell, color: 'text-blue-500', bg: 'bg-blue-100' },
];

export function AdminNotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2e2837]">Notifications Center</h1>
          <p className="font-semibold text-[#8f879f]">Stay updated with platform alerts and events</p>
        </div>
        <Button variant="outline" className="text-sm font-bold w-fit mt-4 md:mt-0">
          Mark all as read
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockNotifications.map((notif) => (
          <Card key={notif.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
             <CardContent className="p-5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className={`p-4 rounded-xl ${notif.bg}`}>
                   <notif.icon className={`h-6 w-6 ${notif.color}`} />
                 </div>
                 <div className="flex flex-col gap-1">
                   <p className="font-bold text-base text-[#2e2837]">{notif.message}</p>
                   <p className="text-xs font-semibold text-muted-foreground">{notif.time}</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
