export const prerender = false; // Bu dosyanın sunucuda canlı çalışmasını sağlar

export async function POST({ request }) {
  try {
    // Formdan gelen verileri alıyoruz
    const data = await request.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const city = data.get("city");
    const service = data.get("service");
    const message = data.get("message");

    // RESEND API İSTEĞİ
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ÖNEMLİ: Bearer kelimesi ve boşluk mutlaka olmalı
        "Authorization": `Bearer re_iJFNPLSX_MoGBc45fNbNLnRk3agvWfQtR`, 
      },
      body: JSON.stringify({
        from: "ProTreeTrim <onboarding@resend.dev>",
        to: ["gorkemcan@aol.com"], // Bildirim senin mailine gelecek
        subject: `New Lead: ${service} in ${city}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332;">New Service Request</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message || "No message provided"}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <small style="color: #888;">Sent from ProTreeTrim.com Contact Form</small>
          </div>
        `,
      }),
    });

    if (response.ok) {
      // BAŞARILI: Kullanıcıyı Teşekkürler sayfasına yönlendir
      return new Response(null, {
        status: 302,
        headers: { "Location": "/thank-you" },
      });
    } else {
      // HATA: Resend tarafından gelen hata
      const errorData = await response.json();
      console.error("Resend API Error:", errorData);
      return new Response("Email failed to send", { status: 500 });
    }
  } catch (error) {
    // SUNUCU HATASI
    console.error("Server Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}