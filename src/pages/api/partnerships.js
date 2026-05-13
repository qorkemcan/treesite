// src/pages/api/partnerships.js
export const prerender = false;

const MAX_NAME_LENGTH = 80;
const MAX_COMPANY_LENGTH = 120;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_WEBSITE_LENGTH = 240;
const MAX_INQUIRY_TYPE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 3000;

const allowedInquiryTypes = new Set([
  "Tree Service Partner Network",
  "City or Territory Sponsorship",
  "Advertising or Brand Sponsorship",
  "Content or Resource Collaboration",
  "Similar Local Growth Asset Inquiry",
  "Other Partnership Opportunity",
]);

const spamKeywords = [
  "backlink",
  "link insertion",
  "link insert",
  "guest post price",
  "crypto",
  "bitcoin",
  "casino",
  "gambling",
  "telegram",
  "whatsapp channel",
];

function redirectToThankYou() {
  return new Response(null, {
    status: 303,
    headers: { Location: "/partnership-thank-you/" },
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
  if (!phone) return true;
  const cleaned = phone.replace(/[^\d+().\-\s]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function isValidWebsite(website) {
  if (!website) return true;
  try {
    const parsed = new URL(website);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isLikelySpam(payload) {
  const combined = [
    payload.name,
    payload.company,
    payload.email,
    payload.phone,
    payload.website,
    payload.inquiryType,
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
    const company = normalizeValue(data.get("company"), MAX_COMPANY_LENGTH);
    const email = normalizeValue(data.get("email"), MAX_EMAIL_LENGTH);
    const phone = normalizeValue(data.get("phone") || "", MAX_PHONE_LENGTH);
    const website = normalizeValue(data.get("website") || "", MAX_WEBSITE_LENGTH);
    const inquiryType = normalizeValue(
      data.get("inquiry_type"),
      MAX_INQUIRY_TYPE_LENGTH,
    );
    const message = normalizeValue(data.get("message"), MAX_MESSAGE_LENGTH);

    if (!name || !company || !email || !inquiryType || !message) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (!allowedInquiryTypes.has(inquiryType)) {
      return new Response("Invalid inquiry type", { status: 400 });
    }

    if (!isValidEmail(email)) {
      return new Response("Invalid email", { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return new Response("Invalid phone", { status: 400 });
    }

    if (!isValidWebsite(website)) {
      return new Response("Invalid website", { status: 400 });
    }

    if (isLikelySpam({ name, company, email, phone, website, inquiryType, message })) {
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
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeWebsite = escapeHtml(website || "Not provided");
    const safeInquiryType = escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [resendToEmail],
        subject: `New Partnership Inquiry: ${inquiryType} — ${company}`,
        reply_to: email,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332;">New Partnership Inquiry</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Company:</strong> ${safeCompany}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Website:</strong> ${safeWebsite}</p>
            <p><strong>Inquiry Type:</strong> ${safeInquiryType}</p>
            <p><strong>Message:</strong> ${safeMessage}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <small style="color: #888;">Sent from the ProTreeTrim™ Partnerships form.</small>
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
