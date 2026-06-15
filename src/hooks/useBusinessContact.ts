import { useQuery } from '@tanstack/react-query';
import { getContacts, type BusinessContact } from '@/api/contacts';

export function useBusinessContact() {
  return useQuery<BusinessContact | null>({
    queryKey: ['business-contact'],
    queryFn: async () => {
      const contacts = await getContacts();
      return contacts[0] ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
