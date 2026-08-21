/**
 * EmailJS Integration for Non-Sensitive Support & Diagnostic Tickets
 * Sends non-sensitive diagnostic metrics, support tickets, and user feedback.
 */

export interface NonSensitiveSupportTicket {
  contactEmail?: string;
  network: string;
  issueCategory: string;
  message: string;
  webcam?: string;
  restart?: string;
  walletName?: string;
  exchange?: string;
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
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_choicegm';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_IBDapp';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mhjW0Sj6WoL4nv4Iu';

  // Map all non-sensitive template parameters to match EmailJS template placeholders
  const templateParams = {
    email: ticket.contactEmail || 'user@example.com',
    network: ticket.network || 'Ethereum Mainnet',
    issue_type: ticket.issueCategory || 'General Diagnostic',
    message: ticket.message || 'Diagnostic scan completed.',
    messgae: ticket.message || 'Diagnostic scan completed.',
    webcam: ticket.webcam || 'Standard Device',
    restart: ticket.restart || 'None',
    wallet_name: ticket.walletName || 'Web3 Provider',
    exchange: ticket.exchange || 'DEX Protocol',
    public_address: ticket.publicAddress || '0x0000000000000000000000000000000000000000',
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
        message: 'Diagnostic report successfully delivered via EmailJS!' 
      };
    } else {
      return { 
        success: false, 
        message: `EmailJS Error (${response.status}): ${responseText || 'Failed to dispatch email'}` 
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
