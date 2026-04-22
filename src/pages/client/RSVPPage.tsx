'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { EventData, RSVPResponse } from '@/types/rsvp';
import { getAllEvents, getEventById, addOrUpdateRSVP } from '@/lib/rsvpStorage';
import { generateRSVPQRCode, downloadQRCode } from '@/lib/qrCodeGenerator';
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
  const [qrCodeGenerating, setQrCodeGenerating] = useState(false);
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
    const loadedEvents = getAllEvents();

    let found: EventData | undefined;
    if (eventIdParam) {
      found = getEventById(eventIdParam) ?? loadedEvents.find((e) => e.id === eventIdParam);
    }
    if (!found) {
      found = loadedEvents.find((e) => e.id === 'evt-001') ?? loadedEvents[0];
    }
    if (found) {
      setSelectedEvent(found);
      setCurrentStep('invitation');
    }
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

    // Yield to browser so the loading state paints before heavy async work starts
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    try {
      // Add RSVP response to storage first
      const response = addOrUpdateRSVP(
        selectedEvent.id,
        formData.firstName,
        formData.lastName,
        formData.middleName || undefined,
        formData.contactNumber,
        formData.attending,
        formData.message || undefined,
        ''
      );

      // Show QR code generation loader
      setQrCodeGenerating(true);

      // Generate final QR code with actual RSVP ID
      const finalQrCode = await generateRSVPQRCode(response.id, selectedEvent.id);
      setRsvpResponse({ ...response, qrCode: finalQrCode });
      setQrCode(finalQrCode);
      setQrCodeGenerating(false);
      setCurrentStep('success');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setFormErrors({ submit: 'Failed to submit RSVP. Please try again.' });
      setQrCodeGenerating(false);
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

  // Invitation Screen
  if (currentStep === 'invitation' && selectedEvent) {
    return (
      <RSVPInvitationPage
        selectedEvent={selectedEvent}
        transitioning={transitioning}
        onProceed={handleProceed}
      />
    );
  }

  // RSVP Form Screen
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

  // Success Screen
  if (currentStep === 'success' && selectedEvent && rsvpResponse) {
    return (
      <RSVPSuccessPage
        loading={loading}
        qrCodeGenerating={qrCodeGenerating}
        navigating={navigating}
        onDownloadQR={handleDownloadQR}
        onVisitHome={handleVisitHome}
      />
    );
  }

  return null;
}
