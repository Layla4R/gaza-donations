// WhatsApp notifications via WABEK (waabek.com) — the WABEK WhatsApp Platform API.
//
// Configuration (env vars):
//   WABEK_API_URL    -> base URL of your WABEK instance, e.g. https://app.waabek.com
//   WABEK_API_KEY    -> API key / access token for your WABEK account
//   WABEK_ADMIN_PHONE-> phone number (international format, digits only, e.g. 201234567890)
//                       that receives admin notifications (new donations, contact messages)
//
// Endpoint: WABEK exposes a message-sending endpoint under /api/v1/messages/send.
// If your WABEK instance uses a different path/version, adjust WABEK_SEND_PATH below
// or set the WABEK_SEND_PATH env var.
//
// All functions in this module fail silently (logging to console) — WhatsApp
// notifications are a best-effort side effect and must never break donation
// or contact-form flows.

const SEND_PATH = process.env.WABEK_SEND_PATH || "/api/v1/messages/send";

function isConfigured() {
  return !!(process.env.WABEK_API_URL && process.env.WABEK_API_KEY);
}

/**
 * Send a WhatsApp text message to a single phone number via WABEK.
 * `phone` must be in international format without "+" (e.g. "201234567890").
 */
export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  if (!isConfigured()) return false;
  if (!phone) return false;

  const url = `${process.env.WABEK_API_URL!.replace(/\/$/, "")}${SEND_PATH}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WABEK_API_KEY}`,
        // Some WABEK setups also accept the key via this header — sent for compatibility.
        "X-API-Key": process.env.WABEK_API_KEY as string,
      },
      body: JSON.stringify({ phone, message }),
    });

    if (!res.ok) {
      console.error("WABEK send failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("WABEK send error:", err);
    return false;
  }
}

/** Send a notification to the configured admin WhatsApp number (WABEK_ADMIN_PHONE). */
export async function notifyAdminWhatsApp(message: string): Promise<boolean> {
  const adminPhone = process.env.WABEK_ADMIN_PHONE;
  if (!adminPhone) return false;
  return sendWhatsAppMessage(adminPhone, message);
}
