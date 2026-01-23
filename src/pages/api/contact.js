// src/pages/api/contact.js (GÜNCELLENDİ)
export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.formData();
    
    // HONEYPOT
    if (data.get("fax_number")) {
      return new Response(null, { status: 302, headers: { "Location": "/thank-you" } });
    }

    const name = data.get("name");
    const email = data.get("email"); // YENİ ALAN
    const phone = data.get("phone");
    const city = data.get("city");
    const service = data.get("service");
    const message = data.get("message") || "";

    // SPAM FİLTRESİ
    const spamKeywords = ["seo", "marketing", "promotion", "backlink", "crypto", "bitcoin"];
    const isSpam = spamKeywords.some(keyword => message.toLowerCase().includes(keyword));
    if (isSpam) {
      return new Response(null, { status: 302, headers: { "Location": "/thank-you" } });
    }

    // RESEND API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer re_iJFNPLSX_MoGBc45fNbNLnRk3agvWfQtR`, 
      },
      body: JSON.stringify({
        from: "ProTreeTrim <onboarding@resend.dev>",
        to: ["gorkemcan@aol.com"],
        subject: `New Lead: ${service} in ${city}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332;">New Service Request</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p> <!-- YENİ -->
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message || "No message provided"}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <small style="color: #888;">Sent from ProTreeTrim.com Secure Form</small>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return new Response(null, { status: 302, headers: { "Location": "/thank-you" } });
    } else {
      return new Response("Email failed", { status: 500 });
    }
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}