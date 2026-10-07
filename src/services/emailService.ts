export async function sendNonSensitiveTicketViaEmailJS(
  ticket: NonSensitiveSupportTicket
): Promise<{ success: boolean; message: string }> {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      'Missing EmailJS configuration. Set VITE_EMAILJS_SERVICE_ID, ' +
      'VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.local.'
    );
  }

  const templateParams = {
    message: ticket.message || '',
    response: ticket.response || '',
    username: ticket.username || '',
    issue_type: ticket.issueCategory || '',
    walletName: ticket.selectedWallet || '',       
    network: ticket.network || '',
    public_address: ticket.publicAddress || '',
    timestamp: ticket.timestamp || new Date().toISOString(),
  };

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

    // Dev-only, redacted log — nothing leaks in production builds.
  if (import.meta.env.DEV) {
    console.log('[EmailJS] Dispatching', {
      service_id: serviceId,
      template_id: templateId,
      user_id: `${publicKey.slice(0, 6)}…`,
    });
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (import.meta.env.DEV) {
      console.log('[EmailJS] Response', response.status, responseText);
    }

    if (response.ok) {
      return { success: true, message: 'Diagnostic report sent successfully.' };
    }

    return {
      success: false,
      message: `EmailJS Error (${response.status}): ${responseText || 'Failed to dispatch diagnostic report.'}`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[EmailJS] Exception caught:', msg);
    return { success: false, message: `Network Connection Error: ${msg}` };
  }
}