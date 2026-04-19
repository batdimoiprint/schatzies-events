'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { EventData, RSVPResponse } from '@/types/rsvp';
import { getAllEvents, getRSVPsByEvent, addOrUpdateRSVP } from '@/lib/rsvpStorage';
import { generateRSVPQRCode, downloadQRCode, generateReferenceCode } from '@/lib/qrCodeGenerator';
import { Check, Download, LogOut } from 'lucide-react';

type PageStep = 'invitation' | 'form' | 'success';

export function RSVPPage() {
  const [currentStep, setCurrentStep] = useState<PageStep>('invitation');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RSVPResponse | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNumber: '',
    attending: true,
    message: '',
  });

  const [eventRsvps, setEventRsvps] = useState<RSVPResponse[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load events on mount and auto-select Kring & Dave's wedding
    const loadedEvents = getAllEvents();

    // Auto-select Kring & Dave's wedding (evt-001)
    const weddingEvent = loadedEvents.find((e) => e.id === 'evt-001');
    if (weddingEvent) {
      selectEvent(weddingEvent);
    } else if (loadedEvents.length > 0) {
      // Fallback to first event if wedding not found
      selectEvent(loadedEvents[0]);
    }
  }, []);

  const selectEvent = (event: EventData) => {
    setSelectedEvent(event);
    const rsvps = getRSVPsByEvent(event.id);
    setEventRsvps(rsvps);
    setCurrentStep('invitation');
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      contactNumber: '',
      attending: true,
      message: '',
    });
    setFormErrors({});
  };

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

    try {
      // Generate QR code first
      const tempQrCode = await generateRSVPQRCode(`temp-${Date.now()}`, selectedEvent.id);

      // Add RSVP response to storage
      const response = addOrUpdateRSVP(
        selectedEvent.id,
        formData.firstName,
        formData.lastName,
        formData.middleName || undefined,
        formData.contactNumber,
        formData.attending,
        formData.message || undefined,
        tempQrCode
      );

      // Generate final QR code with actual RSVP ID
      const finalQrCode = await generateRSVPQRCode(response.id, selectedEvent.id);
      setRsvpResponse({ ...response, qrCode: finalQrCode });
      setQrCode(finalQrCode);
      setCurrentStep('success');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setFormErrors({ submit: 'Failed to submit RSVP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode && rsvpResponse) {
      downloadQRCode(qrCode, `${rsvpResponse.firstName}-${rsvpResponse.lastName}-qrcode.png`);
    }
  };

  const resetForm = () => {
    // Reset form data and go back to invitation
    setCurrentStep('invitation');
    setRsvpResponse(null);
    setQrCode('');
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      contactNumber: '',
      attending: true,
      message: '',
    });
    setFormErrors({});
  };

  // Skip event selection - go directly to invitation if selected event exists

  // Invitation Screen
  if (currentStep === 'invitation' && selectedEvent) {
    return (
      <>
        <LoadingScreen isLoading={loading} />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg overflow-hidden">
            {/* Header Background */}
            <div className="h-20 bg-gradient-to-r from-pink-400 to-pink-500"></div>

            <CardHeader className="text-center -mt-8 relative z-10">
              <CardTitle className="text-3xl font-bold text-pink-600">
                {selectedEvent.couple ? selectedEvent.couple.name1 : 'Our Event'}
              </CardTitle>
              <div className="text-2xl font-bold text-pink-600">
                & {selectedEvent.couple ? selectedEvent.couple.name2 : selectedEvent.title}
              </div>
              <CardDescription className="text-sm mt-2">
                Together with their family and friends invites you to their special occasion!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-pink-50 rounded-lg p-4 space-y-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold text-gray-800">{selectedEvent.date}</p>
                  <p className="text-sm text-gray-600">{selectedEvent.time}</p>
                </div>

                <div className="bg-white rounded p-2 text-center border border-pink-200">
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="font-semibold text-sm text-gray-800">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => setCurrentStep('form')}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                >
                  Proceed to RSVP
                </Button>
                <Button onClick={resetForm} variant="outline" className="w-full">
                  Back
                </Button>
              </div>

              {eventRsvps.length > 0 && (
                <div className="text-center text-xs text-muted-foreground">
                  <p>{eventRsvps.length} guests have already RSVP'd</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // RSVP Form Screen
  if (currentStep === 'form' && selectedEvent) {
    return (
      <>
        <LoadingScreen isLoading={loading} />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-pink-600">
                A Special Celebration Awaits
              </CardTitle>
              <CardDescription className="text-center text-sm">
                We would be honored to hear from you! Please help us plan accordingly.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
                  )}
                </div>

                {/* Middle Name (Optional) */}
                <div>
                  <Label htmlFor="middleName" className="text-sm font-medium">
                    Middle Name <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Input
                    id="middleName"
                    placeholder="Enter your middle name"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <Label htmlFor="contactNumber" className="text-sm font-medium">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="0909 000 0000"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={formErrors.contactNumber ? 'border-red-500' : ''}
                  />
                  {formErrors.contactNumber && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.contactNumber}</p>
                  )}
                </div>

                {/* Attendance */}
                <div>
                  <Label className="text-sm font-medium block mb-2">
                    Will you be able to attend our special occasion?
                  </Label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        checked={formData.attending === true}
                        onChange={() => setFormData({ ...formData, attending: true })}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm">Yes, I will be attending</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        checked={formData.attending === false}
                        onChange={() => setFormData({ ...formData, attending: false })}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm">No, I will not be attending</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Leave a message for the host?
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Share your thoughts or well wishes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {formErrors.submit && (
                  <p className="text-sm text-red-500 text-center">{formErrors.submit}</p>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSubmitRSVP}
                  disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" color="text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Form'
                  )}
                </Button>
                <Button
                  onClick={() => setCurrentStep('invitation')}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Important Note! Please download your digital RSVP QR code below. Having this readily
                on your phone will help us verify you quickly upon arrival!
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Success Screen
  if (currentStep === 'success' && selectedEvent && rsvpResponse) {
    return (
      <>
        <LoadingScreen isLoading={loading} />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-pink-600">Response Received!</CardTitle>
              <CardDescription className="text-sm mt-2">
                We've successfully updated your attendance status. Thank you for celebrating with
                us!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Confirmation Details */}
              <div className="bg-pink-50 rounded-lg p-4 space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Guest Name</p>
                  <p className="font-semibold text-gray-800">
                    {rsvpResponse.firstName} {rsvpResponse.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="font-semibold text-gray-800">
                    {rsvpResponse.attending ? '✓ Will Attend' : '✗ Will Not Attend'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reference Code</p>
                  <p className="font-mono font-semibold text-pink-600">
                    {generateReferenceCode(rsvpResponse.id)}
                  </p>
                </div>
              </div>

              {/* QR Code Display */}
              {qrCode && (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-muted-foreground mb-2">Your Digital RSVP QR Code</p>
                  <div className="bg-white p-3 rounded-lg border border-pink-200">
                    <img src={qrCode} alt="RSVP QR Code" className="w-40 h-40" />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleDownloadQR}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/';
                    link.click();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Visit Schatzies
                </Button>
                <Button onClick={resetForm} variant="ghost" className="w-full">
                  Submit Another RSVP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return null;
}
