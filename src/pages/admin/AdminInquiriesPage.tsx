import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockInquiries = [
  { id: 1, sender: 'Alice Cooper', subject: 'Inquiry for Wedding Package', date: '2 hours ago', status: 'New' },
  { id: 2, sender: 'Bob Martin', subject: 'Corporate Event Pricing', date: '5 hours ago', status: 'In Progress' },
  { id: 3, sender: 'Carol White', subject: 'Availability for June 15', date: '1 day ago', status: 'Resolved' },
  { id: 4, sender: 'David Lee', subject: 'Custom Event Requirements', date: '2 days ago', status: 'Resolved' },
];

export function AdminInquiriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#2e2837]">Client Inquiries</h1>
        <p className="font-semibold text-[#8f879f]">Monitor and respond to incoming event requests</p>
      </div>

      <div className="space-y-4">
        {mockInquiries.map((inquiry) => (
           <Card key={inquiry.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
               <div className="bg-[#f0e8f5] p-3 rounded-full text-[#8f1fd0]">
                 <Mail className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-bold text-lg text-[#2e2837]">{inquiry.subject}</h3>
                 <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                   {inquiry.sender} <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"/> {inquiry.date}
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
               <Badge className={`
                 ${inquiry.status === 'New' ? 'bg-[#ff7eb3] hover:bg-[#ff7eb3] text-white' : ''}
                 ${inquiry.status === 'In Progress' ? 'bg-amber-100 hover:bg-amber-100 text-amber-700' : ''}
                 ${inquiry.status === 'Resolved' ? 'bg-emerald-100 hover:bg-emerald-100 text-emerald-700' : ''}
               `}>
                 {inquiry.status}
               </Badge>
               <Button variant="outline" size="sm" className="font-bold">
                 View Details
               </Button>
             </div>
           </CardContent>
         </Card>
        ))}
      </div>
    </div>
  );
}
