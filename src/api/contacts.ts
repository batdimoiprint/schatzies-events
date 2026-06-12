import axiosInstance from './axios-instance';

export interface ContactAddress {
  id: string;
  label: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  country?: string;
  zipCode?: string;
}

export interface ContactPhone {
  id: string;
  label: string;
  number: string;
  type?: string;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
  platform?: string;
}

export interface ContactEmail {
  id: string;
  label: string;
  email: string;
}

export interface BusinessContact {
  id: string;
  name: string;
  description?: string;
  addresses: ContactAddress[];
  phones: ContactPhone[];
  links: ContactLink[];
  emails: ContactEmail[];
  createdAt?: string;
  updatedAt?: string;
}

export type ContactPhonePayload = Omit<ContactPhone, 'id'>;
export type ContactEmailPayload = Omit<ContactEmail, 'id'>;
export type ContactLinkPayload = Omit<ContactLink, 'id'>;
export type ContactAddressPayload = Omit<ContactAddress, 'id'>;

export async function getContacts(): Promise<BusinessContact[]> {
  const response = await axiosInstance.get('/contacts');
  return response.data.contacts ?? [];
}

export async function getContactById(id: string): Promise<BusinessContact> {
  const response = await axiosInstance.get(`/contacts/${id}`);
  return response.data.contact;
}

export async function createContact(payload: {
  name: string;
  description?: string;
}): Promise<BusinessContact> {
  const response = await axiosInstance.post('/contacts', payload);
  return response.data.contact;
}

export async function updateContact(
  id: string,
  payload: { name?: string; description?: string }
): Promise<BusinessContact> {
  const response = await axiosInstance.patch(`/contacts/${id}`, payload);
  return response.data.contact;
}

export async function deleteContact(id: string): Promise<void> {
  await axiosInstance.delete(`/contacts/${id}`);
}

// ---- Phones ----

export async function addPhone(contactId: string, payload: ContactPhonePayload) {
  const response = await axiosInstance.post(`/contacts/${contactId}/phones`, payload);
  return response.data.phone as ContactPhone;
}

export async function updatePhone(
  contactId: string,
  phoneId: string,
  payload: Partial<ContactPhonePayload>
) {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/phones/${phoneId}`,
    payload
  );
  return response.data.phone as ContactPhone;
}

export async function deletePhone(contactId: string, phoneId: string): Promise<void> {
  await axiosInstance.delete(`/contacts/${contactId}/phones/${phoneId}`);
}

// ---- Emails ----

export async function addEmail(contactId: string, payload: ContactEmailPayload) {
  const response = await axiosInstance.post(`/contacts/${contactId}/emails`, payload);
  return response.data.email as ContactEmail;
}

export async function updateEmail(
  contactId: string,
  emailId: string,
  payload: Partial<ContactEmailPayload>
) {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/emails/${emailId}`,
    payload
  );
  return response.data.email as ContactEmail;
}

export async function deleteEmail(contactId: string, emailId: string): Promise<void> {
  await axiosInstance.delete(`/contacts/${contactId}/emails/${emailId}`);
}

// ---- Social Links ----

export async function addLink(contactId: string, payload: ContactLinkPayload) {
  const response = await axiosInstance.post(`/contacts/${contactId}/links`, payload);
  return response.data.link as ContactLink;
}

export async function updateLink(
  contactId: string,
  linkId: string,
  payload: Partial<ContactLinkPayload>
) {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/links/${linkId}`,
    payload
  );
  return response.data.link as ContactLink;
}

export async function deleteLink(contactId: string, linkId: string): Promise<void> {
  await axiosInstance.delete(`/contacts/${contactId}/links/${linkId}`);
}

// ---- Addresses / Locations ----

export async function addAddress(contactId: string, payload: ContactAddressPayload) {
  const response = await axiosInstance.post(`/contacts/${contactId}/addresses`, payload);
  return response.data.address as ContactAddress;
}

export async function updateAddress(
  contactId: string,
  addressId: string,
  payload: Partial<ContactAddressPayload>
) {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/addresses/${addressId}`,
    payload
  );
  return response.data.address as ContactAddress;
}

export async function deleteAddress(contactId: string, addressId: string): Promise<void> {
  await axiosInstance.delete(`/contacts/${contactId}/addresses/${addressId}`);
}
