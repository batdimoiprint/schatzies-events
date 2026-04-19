import QRCode from 'qrcode';

/**
 * Generate a QR code for an RSVP response
 * @param rsvpId - The RSVP response ID
 * @param eventId - The event ID
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateRSVPQRCode(rsvpId: string, eventId: string): Promise<string> {
  try {
    // Create a simple but unique QR code data
    const qrData = JSON.stringify({
      rsvpId,
      eventId,
      timestamp: Date.now(),
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
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
