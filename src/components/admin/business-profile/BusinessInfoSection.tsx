import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Link2, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  addAddress,
  addEmail,
  addLink,
  addPhone,
  createContact,
  deleteAddress,
  deleteEmail,
  deleteLink,
  deletePhone,
  getContacts,
  updateAddress,
  updateContact,
  updateEmail,
  updateLink,
  updatePhone,
  type BusinessContact,
} from '@/api/contacts';

type SectionKey = 'phone' | 'email' | 'link' | 'address';

interface FieldDef {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

const SECTION_CONFIG: Record<
  SectionKey,
  { title: string; singular: string; icon: typeof Phone; fields: FieldDef[] }
> = {
  phone: {
    title: 'Contact Numbers',
    singular: 'Contact Number',
    icon: Phone,
    fields: [
      { name: 'label', label: 'Label', placeholder: 'Main Line', required: true },
      { name: 'number', label: 'Number', placeholder: '+63 912 345 6789', required: true },
      { name: 'type', label: 'Type', placeholder: 'mobile / landline' },
    ],
  },
  email: {
    title: 'Email Addresses',
    singular: 'Email Address',
    icon: Mail,
    fields: [
      { name: 'label', label: 'Label', placeholder: 'General Inquiries', required: true },
      { name: 'email', label: 'Email', placeholder: 'hello@schatzies.com', required: true },
    ],
  },
  link: {
    title: 'Social Links',
    singular: 'Social Link',
    icon: Link2,
    fields: [
      { name: 'label', label: 'Label', placeholder: 'Facebook Page', required: true },
      { name: 'platform', label: 'Platform', placeholder: 'Facebook' },
      { name: 'url', label: 'URL', placeholder: 'https://facebook.com/schatzies', required: true },
    ],
  },
  address: {
    title: 'Locations',
    singular: 'Location',
    icon: MapPin,
    fields: [
      { name: 'label', label: 'Label', placeholder: 'Head Office', required: true },
      { name: 'street', label: 'Street', placeholder: '123 Main St' },
      { name: 'barangay', label: 'Barangay' },
      { name: 'city', label: 'City' },
      { name: 'province', label: 'Province' },
      { name: 'country', label: 'Country' },
      { name: 'zipCode', label: 'Zip Code' },
    ],
  },
};

type FormValues = Record<string, string>;

interface DialogState {
  section: SectionKey;
  itemId: string | null;
  values: FormValues;
}

function itemSummary(section: SectionKey, item: Record<string, unknown>): string {
  switch (section) {
    case 'phone':
      return String(item.number ?? '');
    case 'email':
      return String(item.email ?? '');
    case 'link':
      return String(item.url ?? '');
    case 'address':
      return [item.street, item.barangay, item.city, item.province, item.country, item.zipCode]
        .filter(Boolean)
        .join(', ');
  }
}

export function BusinessInfoSection() {
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', description: '' });
  const [contactError, setContactError] = useState<string | null>(null);

  const { data: contacts = [], isLoading } = useQuery<BusinessContact[]>({
    queryKey: ['business-contacts'],
    queryFn: getContacts,
  });
  const contact = contacts[0] ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['business-contacts'] });

  const setupMutation = useMutation({
    mutationFn: () =>
      createContact({ name: 'Schatzies Events', description: 'Business contact information' }),
    onSuccess: invalidate,
  });

  const updateContactMutation = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      updateContact(contact!.id, payload),
    onSuccess: () => {
      invalidate();
      setEditingContact(false);
      setContactError(null);
    },
    onError: (err) => setContactError(err instanceof Error ? err.message : 'Unable to save'),
  });

  const saveMutation = useMutation({
    mutationFn: async (state: DialogState) => {
      if (!contact) throw new Error('No business contact');
      const { section, itemId, values } = state;
      const payload = values as never;
      if (section === 'phone') {
        return itemId ? updatePhone(contact.id, itemId, payload) : addPhone(contact.id, payload);
      }
      if (section === 'email') {
        return itemId ? updateEmail(contact.id, itemId, payload) : addEmail(contact.id, payload);
      }
      if (section === 'link') {
        return itemId ? updateLink(contact.id, itemId, payload) : addLink(contact.id, payload);
      }
      return itemId ? updateAddress(contact.id, itemId, payload) : addAddress(contact.id, payload);
    },
    onSuccess: () => {
      invalidate();
      setDialogState(null);
      setSaveError(null);
    },
    onError: (error) => {
      setSaveError(error instanceof Error ? error.message : 'Unable to save');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ section, itemId }: { section: SectionKey; itemId: string }) => {
      if (!contact) throw new Error('No business contact');
      if (section === 'phone') return deletePhone(contact.id, itemId);
      if (section === 'email') return deleteEmail(contact.id, itemId);
      if (section === 'link') return deleteLink(contact.id, itemId);
      return deleteAddress(contact.id, itemId);
    },
    onSuccess: invalidate,
  });

  const openDialog = (section: SectionKey, item?: Record<string, string>) => {
    const values: FormValues = {};
    for (const field of SECTION_CONFIG[section].fields) {
      values[field.name] = item?.[field.name] ?? '';
    }
    setSaveError(null);
    setDialogState({ section, itemId: item?.id ?? null, values });
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-sm text-muted-foreground shadow-[0_8px_30px_rgba(61,32,82,0.08)]">
        Loading business information...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(61,32,82,0.08)]">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand/5">
            <Building2 className="size-8 text-brand" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">No business profile yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Set up your business profile to manage contact numbers, emails, social links, and
            locations.
          </p>
          <Button
            onClick={() => setupMutation.mutate()}
            disabled={setupMutation.isPending}
            className="mt-6 rounded-full bg-brand px-6 text-xs font-bold text-white shadow-md hover:bg-brand"
          >
            {setupMutation.isPending ? 'Setting up...' : 'Set Up Business Profile'}
          </Button>
        </div>
      </div>
    );
  }

  const sectionItems: Record<SectionKey, Array<Record<string, string>>> = {
    phone: (contact.phones ?? []) as never,
    email: (contact.emails ?? []) as never,
    link: (contact.links ?? []) as never,
    address: (contact.addresses ?? []) as never,
  };

  const config = dialogState ? SECTION_CONFIG[dialogState.section] : null;

  return (
    <div className="space-y-6">
      {/* Contact identity */}
      <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(61,32,82,0.08)]">
        {editingContact ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateContactMutation.mutate(contactForm);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="bc-name">Business Name <span className="text-brand">*</span></Label>
              <Input
                id="bc-name"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bc-desc">Description</Label>
              <Textarea
                id="bc-desc"
                rows={2}
                value={contactForm.description}
                onChange={(e) => setContactForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            {contactError && <p className="text-sm text-red-600">{contactError}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingContact(false)}
                disabled={updateContactMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateContactMutation.isPending}
                className="rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
              >
                {updateContactMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/5">
                <Building2 className="size-5 text-brand" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">{contact.name}</p>
                {contact.description && (
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit business name"
              onClick={() => {
                setContactForm({ name: contact.name, description: contact.description ?? '' });
                setContactError(null);
                setEditingContact(true);
              }}
              className="size-8 text-brand-deep hover:bg-[#f0e8f5]"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
      {(Object.keys(SECTION_CONFIG) as SectionKey[]).map((section) => {
        const { title, icon: Icon } = SECTION_CONFIG[section];
        const items = sectionItems[section];
        return (
          <div
            key={section}
            className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(61,32,82,0.08)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-brand/5">
                  <Icon className="size-4 text-brand" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
              </div>
              <Button
                size="sm"
                onClick={() => openDialog(section)}
                className="gap-1.5 rounded-full bg-brand px-4 text-xs font-bold text-white shadow-md hover:bg-brand"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No {title.toLowerCase()} added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#f0e8f5] px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#2d1b3d]">{item.label}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {itemSummary(section, item)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.label}`}
                        onClick={() => openDialog(section, item)}
                        className="size-8 text-brand-deep hover:bg-[#f0e8f5]"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${item.label}`}
                        onClick={() => deleteMutation.mutate({ section, itemId: item.id })}
                        disabled={deleteMutation.isPending}
                        className="size-8 text-brand hover:bg-brand/5"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      <Dialog open={dialogState !== null} onOpenChange={(open) => !open && setDialogState(null)}>
        <DialogContent className="sm:max-w-md">
          {dialogState && config && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl font-bold text-foreground">
                  {dialogState.itemId ? 'Edit' : 'Add'} {config.singular}
                </DialogTitle>
                <DialogDescription>
                  {dialogState.itemId
                    ? `Update this ${config.singular.toLowerCase()}.`
                    : `Add a new ${config.singular.toLowerCase()} to your business profile.`}
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMutation.mutate(dialogState);
                }}
              >
                {config.fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={`bi-${field.name}`}>
                      {field.label}
                      {field.required && <span className="text-brand"> *</span>}
                    </Label>
                    <Input
                      id={`bi-${field.name}`}
                      value={dialogState.values[field.name]}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) =>
                        setDialogState((prev) =>
                          prev
                            ? { ...prev, values: { ...prev.values, [field.name]: e.target.value } }
                            : prev
                        )
                      }
                    />
                  </div>
                ))}
                {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogState(null)}
                    disabled={saveMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
                  >
                    {saveMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
}
