import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';

import type { EventData, RSVPResponse } from '@/types/rsvp';
import axiosInstance from '@/api/axios-instance';
import { downloadQRCode } from '@/lib/qrCodeGenerator';
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
    email: '',
    contactNumber: '',
    attending: true,
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const eventIdParam = searchParams.get('eventId');

    // Fetch event details from backend
    const fetchEvent = async () => {
      if (!eventIdParam) return;
      try {
        const response = await axiosInstance.get(`/events/${eventIdParam}`);
        const eventData = response.data.event || response.data;

        // Fetch full details to get organizer name
        let organizerName = eventData.clientName || eventData.client || 'Schatzies Events';
        const orgId = eventData.organizer_id || eventData.organizerId;
        if (orgId) {
          try {
            const orgResponse = await axiosInstance.get(`/users/${orgId}`);
            const orgData = orgResponse.data.user || orgResponse.data;
            organizerName =
              `${orgData.firstName || ''} ${orgData.lastName || ''}`.trim() || organizerName;
          } catch (e) {
            /* ignore */
          }
        }

        // Map backend fields to the format the invitation page expects
        setSelectedEvent({
          id: eventData.id,
          title: eventData.title || 'Wedding Celebration',
          date:
            eventData.endDate ||
            eventData.dateEnd ||
            eventData.invitationDate ||
            eventData.startDate ||
            eventData.eventDate ||
            eventData.dateStart ||
            '',
          time:
            eventData.eventTime ||
            eventData.startTime ||
            (eventData.dateStart
              ? new Date(eventData.dateStart).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'TBA'),
          location: eventData.venue || eventData.location || 'TBA',
          couple: {
            name1: eventData.title || 'Event',
            name2: '',
          },
          organizerName: organizerName,
          description: eventData.eventType || '',
        });
      } catch (error) {
        console.error('Error fetching event from API:', error);
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
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
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
      // Check if email already exists in the system
      try {
        const checkResponse = await axiosInstance.get(
          `/rsvp/check-email/${formData.email}?eventId=${selectedEvent.id}`
        );
        if (checkResponse.data.exists) {
          setFormErrors({
            email:
              'This email has already been registered for this event. Please use a different email or contact support.',
          });
          setLoading(false);
          return;
        }
      } catch (checkError) {
        // If the endpoint doesn't exist, continue with submission
        console.log('Email check endpoint not available, proceeding with submission');
      }

      // Map frontend state to backend expected snake_case payload
      const payload = {
        event_id: selectedEvent.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        ...(formData.middleName && { middle_name: formData.middleName }),
        email: formData.email,
        contact_number: formData.contactNumber,
        status: formData.attending ? 'ATTENDING' : 'NOT_ATTENDING',
        ...(formData.message && { message: formData.message }),
      };

      // POST to backend RSVP endpoint
      const response = await axiosInstance.post('/rsvp', payload);

      // Set response data - use backend response values if available, otherwise default to unverified
      const finalRsvp = {
        id: response.data.guestId || response.data.id || `guest-${Date.now()}`,
        eventId: selectedEvent.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        attending: formData.attending,
        status: formData.attending ? 'Attending' : 'Not Attending',
        isScanned: false,
        isVerified: response.data.isVerified || false,
        qrCode: response.data.qrCode || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRsvpResponse(finalRsvp);
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      }
      setCurrentStep('success');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      // Capture backend error messages like "Event capacity has been reached"
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || 'Failed to submit RSVP. Please try again.';
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
        isAttending={formData.attending}
        isVerified={rsvpResponse.isVerified || false}
        navigating={navigating}
        onDownloadQR={handleDownloadQR}
        onVisitHome={handleVisitHome}
      />
    );
  }

  return null;
}
