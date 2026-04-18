import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockVendors = [
  { id: 1, name: 'Creative Caterers', category: 'Food & Beverage', rating: 4.8, status: 'Available', eventsDone: 112 },
  { id: 2, name: 'Lens Magic Studio', category: 'Photography', rating: 4.9, status: 'Booked', eventsDone: 84 },
  { id: 3, name: 'Floral Essence', category: 'Decorations', rating: 4.6, status: 'Available', eventsDone: 230 },
  { id: 4, name: 'Sound & Soul', category: 'Audio/Visual', rating: 4.7, status: 'Available', eventsDone: 156 },
  { id: 5, name: 'Royal Rides', category: 'Transportation', rating: 4.5, status: 'Available', eventsDone: 45 },
];

export function AdminVendorPoolPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2e2837]">Vendor Pool</h1>
          <p className="font-semibold text-[#8f879f]">Manage and track your outsourced event vendors</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-8 bg-white border-none shadow-sm" />
          </div>
          <Button className="bg-[#ff7eb3] hover:bg-[#ff6aa5] text-white">Add Vendor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVendors.map((vendor) => (
          <Card key={vendor.id} className="border-none shadow-sm flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#ff7eb3]" />
                    <CardTitle className="text-lg font-bold">{vendor.name}</CardTitle>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">{vendor.category}</p>
                </div>
                <Badge variant={vendor.status === 'Available' ? 'default' : 'secondary'} className={vendor.status === 'Available' ? 'bg-[#29bf4c] hover:bg-[#23a542]' : ''}>
                  {vendor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {vendor.rating}
                </div>
                <div className="font-semibold text-muted-foreground">
                  {vendor.eventsDone} Events
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
