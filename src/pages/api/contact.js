// src/pages/api/contact.js
export const prerender = false;

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_CITY_LENGTH = 80;
const MAX_SERVICE_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 2000;

const spamKeywords = [
  "seo",
  "marketing",
  "promotion",
  "backlink",
  "crypto",
  "bitcoin",
  "casino",
  "gambling",
  "telegram",
  "whatsapp",
];

function redirectToThankYou() {
  return new Response(null, {
    status: 303,
    headers: { Location: "/thank-you" },
  });
}

function normalizeValue(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d+().\-\s]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function isLikelySpam(payload) {
  const combined = [
    payload.name,
    payload.email,
    payload.phone,
    payload.city,
    payload.service,
    payload.message,
  ]
    .join(" ")
    .toLowerCase();

  return spamKeywords.some((keyword) => combined.includes(keyword));
}

export async function POST({ request, url }) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== url.origin) {
      return new Response("Forbidden", { status: 403 });
    }

    const data = await request.formData();

    if (data.get("fax_number")) {
      return redirectToThankYou();
    }

    const name = normalizeValue(data.get("name"), MAX_NAME_LENGTH);
    const email = normalizeValue(data.get("email"), MAX_EMAIL_LENGTH);
    const phone = normalizeValue(data.get("phone"), MAX_PHONE_LENGTH);
    const city = normalizeValue(data.get("city"), MAX_CITY_LENGTH);
    const service = normalizeValue(data.get("service"), MAX_SERVICE_LENGTH);
    const message = normalizeValue(
      data.get("message") || "",
      MAX_MESSAGE_LENGTH,
    );

    if (!name || !email || !phone || !city || !service) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (!isValidEmail(email)) {
      return new Response("Invalid email", { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return new Response("Invalid phone", { status: 400 });
    }

    if (isLikelySpam({ name, email, phone, city, service, message })) {
      return redirectToThankYou();
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const resendFromEmail =
      import.meta.env.RESEND_FROM_EMAIL || "ProTreeTrim <onboarding@resend.dev>";
    const resendToEmail =
      import.meta.env.RESEND_TO_EMAIL || "gorkemcan@aol.com";

    if (!resendApiKey) {
      return new Response("Email service is not configured", { status: 500 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCity = escapeHtml(city);
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message || "No message provided");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [resendToEmail],
        subject: `New Lead: ${service} in ${city}`,
        reply_to: email,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332;">New Service Request</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>City:</strong> ${safeCity}</p>
            <p><strong>Service:</strong> ${safeService}</p>
            <p><strong>Message:</strong> ${safeMessage}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <small style="color: #888;">Sent from ProTreeTrim.com Secure Form</small>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Email failed: ${errorText}`, { status: 500 });
    }

    return redirectToThankYou();
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}