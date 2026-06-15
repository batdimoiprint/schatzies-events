import axiosInstance from './axios-instance';

/**
 * Combined check and send verification:
 * 1. Checks if email is already verified.
 * 2. If not, sends a verification email.
 *
 * Returns { verified: true } or { verified: false, emailSent: true }
 * Backend: POST /api/auth/check-or-send-verification
 */
export async function checkOrSendVerification(
  email: string,
  pendingInquiry?: Record<string, unknown>
): Promise<{ verified: boolean; emailSent?: boolean; reason?: string; alreadyUsed?: boolean }> {
  const { data } = await axiosInstance.post<{
    verified: boolean;
    emailSent?: boolean;
    reason?: string;
    alreadyUsed?: boolean;
  }>('/auth/check-or-send-verification', { email, pendingInquiry });
  return data;
}

/**
 * Request a verification email to be sent to the given address.
 * Backend: POST /api/auth/send-verification-email (Legacy - use checkOrSendVerification)
 */
export async function sendVerificationEmail(
  email: string
): Promise<{ message: string; alreadyVerified?: boolean }> {
  const { data } = await axiosInstance.post<{
    message: string;
    alreadyVerified?: boolean;
  }>('/auth/send-verification-email', { email });
  return data;
}

/**
 * Check whether a given email address has been verified.
 * Backend: GET /api/auth/check-email-verified?email=...
 */
export async function checkEmailVerified(
  email: string
): Promise<{ email: string; verified: boolean }> {
  const { data } = await axiosInstance.get<{
    email: string;
    verified: boolean;
  }>('/auth/check-email-verified', { params: { email } });
  return data;
}

export interface VerifiedEmail {
  email: string;
  verified: boolean;
  verifiedAt: string;
}

/**
 * Get all verified email addresses (admin).
 * Backend: GET /api/auth/verified-emails
 */
export async function getVerifiedEmails(): Promise<{
  emails: VerifiedEmail[];
  total: number;
}> {
  const { data } = await axiosInstance.get<{
    emails: VerifiedEmail[];
    total: number;
  }>('/auth/verified-emails');
  return data;
}

/**
 * Delete a verified email record (admin).
 * Backend: DELETE /api/auth/verified-emails/:email
 */
export async function deleteVerifiedEmail(
  email: string
): Promise<{ email: string; deleted: boolean }> {
  const { data } = await axiosInstance.delete<{
    email: string;
    deleted: boolean;
  }>(`/auth/verified-emails/${encodeURIComponent(email)}`);
  return data;
}
