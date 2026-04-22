import QRCode from 'qrcode';

/**
 * Generate a QR code for an RSVP response that redirects to the RSVP page
 * @param rsvpId - The RSVP response ID
 * @param eventId - The event ID
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateRSVPQRCode(rsvpId: string, eventId: string): Promise<string> {
  try {
    // Get the current origin (localhost:5173, production domain, etc.)
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

    // Create a URL that will redirect to the RSVP page with event and RSVP info
    const qrUrl = `${origin}/rsvp?eventId=${eventId}&rsvpId=${rsvpId}`;

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate a simple alphanumeric code for quick reference
 * @param rsvpId - The RSVP response ID
 * @returns string - A short reference code
 */
export function generateReferenceCode(rsvpId: string): string {
  // Take last 8 characters and convert to uppercase
  const code = rsvpId.split('-').pop()?.toUpperCase() || rsvpId.substring(0, 8).toUpperCase();
  return code;
}

/**
 * Download QR code image
 * @param dataUrl - The data URL of the QR code
 * @param filename - The filename for download
 */
export function downloadQRCode(dataUrl: string, filename: string = 'rsvp-qrcode.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
