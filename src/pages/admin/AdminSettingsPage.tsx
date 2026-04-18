import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Globe, Shield, CreditCard, Palette } from 'lucide-react';

export function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#2e2837]">Platform Settings</h1>
        <p className="font-semibold text-[#8f879f]">Configure global preferences and system options</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#3b7cde]" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Platform Name</Label>
                <Input defaultValue="Schatzies Events" className="bg-gray-50 border-transparent font-semibold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Support Email</Label>
                <Input defaultValue="support@schatziesevents.com" className="bg-gray-50 border-transparent font-semibold" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">TimeZone</Label>
                <Input defaultValue="Asia/Manila" className="bg-gray-50 border-transparent font-semibold" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#db37b4]" />
                Payment Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Stripe Public Key</Label>
                <Input type="password" defaultValue="pk_test_xxxxxxxxxxxxxxxx" className="bg-gray-50 border-transparent" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Currency</Label>
                <Input defaultValue="PHP" className="bg-gray-50 border-transparent font-semibold w-1/4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#29bf4c]" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-sm">Two-Factor Authentication</Label>
                <div className="flex items-center gap-2 border rounded-md p-3 bg-gray-50 text-sm font-semibold text-muted-foreground">
                  Enabled for Admin Role
                </div>
              </div>
              <Button variant="outline" className="w-full font-bold">Manage Roles</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-linear-to-r from-[#51a3f0] to-[#1f4ad0] text-white">
            <CardContent className="p-6 text-center space-y-4">
              <Palette className="h-10 w-10 mx-auto opacity-75" />
              <div>
                <h3 className="font-bold text-xl">Appearance</h3>
                <p className="text-sm font-medium opacity-80 mt-1">Customize primary colors and branding.</p>
              </div>
              <Button variant="secondary" className="w-full font-bold mt-4 text-[#1f4ad0]">Theme Setup</Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
             <Button variant="outline" className="font-bold">Discard</Button>
             <Button className="bg-[#ff4e9e] hover:bg-[#eb388b] text-white font-bold flex gap-2 w-full">
               <Save className="h-4 w-4" />
               Save Changes
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
