export const prerender = false; // Bu dosyanın sunucuda canlı çalışmasını sağlar

export async function POST({ request }) {
  try {
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
        "Authorization": `re_iJFNPLSX_MoGBc45fNbNLnRk3agvWfQtR`, 
      },
      body: JSON.stringify({
        from: "ProTreeTrim <onboarding@resend.dev>",
        to: ["gorkemcan@aol.com"], // Bildirim hangi mailine gelsin?
        subject: `New Lead: ${service} in ${city}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1b4332;">New Service Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      // Başarılıysa kullanıcıyı geri gönder ve URL'ye "success" ekle
      return new Response(null, {
        status: 302,
        headers: { "Location": "/contact?status=success" },
      });
    } else {
      return new Response("E-posta gönderilemedi", { status: 500 });
    }
  } catch (error) {
    return new Response("Sunucu hatası", { status: 500 });
  }
}