import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { EventData, RSVPResponse } from '@/types/rsvp';
import axiosInstance from '@/api/axios-instance'; // Added for API calls
import { downloadQRCode } from '@/lib/qrCodeGenerator';
import { getEventById } from '@/lib/rsvpStorage';
import { RSVPInvitationPage } from './RSVPInvitationPage';
import { RSVPFormPage } from './RSVPFormPage';
import { RSVPSuccessPage } from './RSVPSuccessPage';

type PageStep = 'invitation' | 'form' | 'success';

export function RSVPPage() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<PageStep>('invitation');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RSVPResponse | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNumber: '',
    attending: true,
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const eventIdParam = searchParams.get('eventId');

    // Fetch event details from backend to ensure capacity and existence
    const fetchEvent = async () => {
      if (!eventIdParam) return;
      try {
        const response = await axiosInstance.get(`/events/${eventIdParam}`);
        const eventData = response.data.event || response.data;
        
        // Map backend fields to the format the invitation page expects
        setSelectedEvent({
          id: eventData.id,
          title: eventData.title || 'Wedding Celebration',
          date: eventData.dateStart || eventData.startDate || eventData.eventDate || '',
          time: eventData.dateStart ? new Date(eventData.dateStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA',
          location: eventData.venue || eventData.location || 'TBA',
          couple: {
            name1: eventData.title?.split('&')[0]?.trim() || 'Partner 1',
            name2: eventData.title?.split('&')[1]?.trim() || 'Partner 2',
          },
          organizerName: eventData.clientName || 'Schatzies Events',
          description: eventData.eventType || '',
        });
      } catch (error) {
        console.error('Error fetching event from API, trying local storage:', error);
        // Fallback to local storage for demo events like evt-001
        const localEvent = getEventById(eventIdParam);
        if (localEvent) {
          setSelectedEvent(localEvent);
        }
      }
    };

    fetchEvent();
  }, [searchParams]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^[\d+\-() ]+$/.test(formData.contactNumber)) {
      errors.contactNumber = 'Please enter a valid contact number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRSVP = async () => {
    if (!validateForm() || !selectedEvent) return;

    setLoading(true);
    setFormErrors({});

    try {
      // Map frontend state to backend expected snake_case payload
      const payload = {
        event_id: selectedEvent.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || undefined,
        contact_number: formData.contactNumber,
        status: formData.attending ? 'ATTENDING' : 'NOT_ATTENDING',
        message: formData.message || undefined,
      };

      // POST to backend RSVP endpoint
      const response = await axiosInstance.post('/rsvp', payload);
      
      // Swagger says it returns "RSVP submitted successfully" (a string)
      // So we generate a QR code locally for the guest
      const { generateRSVPQRCode } = await import('@/lib/qrCodeGenerator');
      
      // Use a combination of eventId and name/contact to create a stable unique ID if possible
      // or just a timestamp for now
      // Get the REAL ID from the backend response
      const createdGuest = response.data.guest || response.data;
      const guestId = createdGuest.guestId || createdGuest.id || createdGuest.SK?.split('#')[1] || `guest-${Date.now()}`;
      
      const invitationUrl = `${window.location.origin}/invitation/${selectedEvent.id}/${guestId}`;
      const qrCodeUrl = await generateRSVPQRCode(invitationUrl, selectedEvent.id);

      setRsvpResponse({
        id: guestId,
        eventId: selectedEvent.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        attending: formData.attending,
        status: formData.attending ? 'Attending' : 'Not Attending',
        isScanned: false,
        qrCode: qrCodeUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setQrCode(qrCodeUrl);
      setCurrentStep('success');
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      // Capture backend error messages like "Event capacity has been reached"
      const message = error.response?.data?.message || 'Failed to submit RSVP. Please try again.';
      setFormErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode && rsvpResponse) {
      downloadQRCode(qrCode, `${rsvpResponse.firstName}-${rsvpResponse.lastName}-qrcode.png`);
    }
  };

  const handleProceed = () => {
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      setCurrentStep('form');
    }, 800);
  };

  const handleVisitHome = () => {
    setNavigating(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.location.href = '/';
      }, 600);
    });
  };

  if (currentStep === 'invitation' && selectedEvent) {
    return (
      <RSVPInvitationPage
        selectedEvent={selectedEvent}
        transitioning={transitioning}
        onProceed={handleProceed}
      />
    );
  }

  if (currentStep === 'form' && selectedEvent) {
    return (
      <RSVPFormPage
        formData={formData}
        formErrors={formErrors}
        loading={loading}
        onFormChange={setFormData}
        onSubmit={handleSubmitRSVP}
      />
    );
  }

  if (currentStep === 'success' && selectedEvent && rsvpResponse) {
    return (
      <RSVPSuccessPage
        loading={loading}
        qrCode={qrCode}
        navigating={navigating}
        onDownloadQR={handleDownloadQR}
        onVisitHome={handleVisitHome}
      />
    );
  }

  return null;
}