import { useQuery } from '@tanstack/react-query';
import { getContacts, type BusinessContact } from '@/api/contacts';

export const DEFAULT_CONTACT: BusinessContact = {
  id: 'default',
  name: 'Schatzies Events Management',
  description: 'Premium wedding and debut planning in the Philippines.',
  phones: [
    { id: 'p1', label: 'Primary Mobile', number: '0917 502 3538' },
    { id: 'p2', label: 'Secondary Mobile', number: '0933 380 7868' }
  ],
  emails: [
    { id: 'e1', label: 'Inquiries', email: 'schatziesevents@gmail.com' }
  ],
  links: [
    { id: 'l1', label: 'Facebook', url: 'https://www.facebook.com/debutandweddingpackage', platform: 'Facebook' },
    { id: 'l2', label: 'Instagram', url: 'https://www.instagram.com/schatziesevents', platform: 'Instagram' }
  ],
  addresses: [
    {
      id: 'a1',
      label: 'Quezon City Branch',
      street: 'Quezon City',
      city: 'Metro Manila',
      country: 'Philippines'
    },
    {
      id: 'a2',
      label: 'Tagaytay Branch',
      street: 'Tagaytay City',
      city: 'Cavite',
      country: 'Philippines'
    }
  ]
};

export function useBusinessContact() {
  return useQuery<BusinessContact | null>({
    queryKey: ['business-contact'],
    queryFn: async () => {
      try {
        const contacts = await getContacts();
        return contacts[0] ?? DEFAULT_CONTACT;
      } catch (err) {
        console.warn('Failed to fetch business contact, using default fallback:', err);
        return DEFAULT_CONTACT;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
