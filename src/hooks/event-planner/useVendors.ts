import { useState } from 'react';
import { getVendors, getVendorsByEventId, assignVendorToEvent, unassignVendorFromEvent } from '@/api/vendors';
import type { EventManagerVendor, Vendor } from '@/api/vendors';

export function useVendors(selectedEventId: string) {
  const [eventVendors, setEventVendors] = useState<EventManagerVendor[]>([]);
  const [vendorPool, setVendorPool] = useState<Vendor[]>([]);
  const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
  const [isAssigningVendor, setIsAssigningVendor] = useState(false);

  const normalizeStatus = (status: string) => String(status).trim().toLowerCase() === 'active' ? 'active' : 'inactive';

  const loadVendors = async () => {
    if (!selectedEventId) {
      setEventVendors([]);
      return;
    }
    try {
      const vendorsData = await getVendorsByEventId(selectedEventId);
      setEventVendors(vendorsData || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      setEventVendors([]);
    }
  };

  const handleOpenAssignVendorModal = async (vendorIdOrServiceType?: string) => {
    // If a vendor ID is passed directly (from the VendorsTab category pool), assign directly
    if (vendorIdOrServiceType) {
      await handleAssignVendor(vendorIdOrServiceType);
      return;
    }

    // Legacy: open modal for general assignment
    setIsAssigningVendor(true);
    try {
      const allVendors = await getVendors();
      setVendorPool(allVendors.filter((v) => normalizeStatus(v.status) === 'active'));
      setIsAssignVendorModalOpen(true);
    } catch (error) {
      console.error('Failed to load vendors pool:', error);
      alert('Failed to load vendors pool.');
    } finally {
      setIsAssigningVendor(false);
    }
  };

  const handleAssignVendor = async (vendorId: string) => {
    setIsAssigningVendor(true);
    try {
      await assignVendorToEvent(vendorId, selectedEventId);
      const vendorsData = await getVendorsByEventId(selectedEventId);
      setEventVendors(vendorsData || []);
      setIsAssignVendorModalOpen(false);
    } catch (error) {
      console.error('Failed to assign vendor:', error);
      alert('Failed to assign vendor. Please try again.');
    } finally {
      setIsAssigningVendor(false);
    }
  };

  const handleUnassignVendor = async (vendorId: string) => {
    if (!window.confirm('Are you sure you want to unassign this vendor?')) return;
    try {
      await unassignVendorFromEvent(vendorId);
      const vendorsData = await getVendorsByEventId(selectedEventId);
      setEventVendors(vendorsData || []);
    } catch (error) {
      console.error('Failed to unassign vendor:', error);
      alert('Failed to unassign vendor. Please try again.');
    }
  };

  return {
    eventVendors, setEventVendors, vendorPool, isAssignVendorModalOpen, setIsAssignVendorModalOpen, isAssigningVendor,
    handleOpenAssignVendorModal, handleAssignVendor, handleUnassignVendor, loadVendors
  };
}