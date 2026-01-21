export const prerender = false; 

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const city = data.get("city");
    const service = data.get("service");
    const message = data.get("message");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Bearer kelimesi eklendi (Kritik!)
        "Authorization": `Bearer re_iJFNPLSX_MoGBc45fNbNLnRk3agvWfQtR`, 
      },
      body: JSON.stringify({
        from: "ProTreeTrim <onboarding@resend.dev>",
        to: ["gorkemcan@aol.com"], 
        subject: `New Lead: ${service} in ${city}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332;">New Service Request</h2>
            <hr/>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message}</p>
            <hr/>
            <small style="color: #666;">Sent from ProTreeTrim Contact Form</small>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/contact?status=success" },
      });
    } else {
      const errorData = await response.json();
      console.error("Resend Error:", errorData);
      return new Response("E-posta gönderilemedi", { status: 500 });
    }
  } catch (error) {
    return new Response("Sunucu hatası", { status: 500 });
  }
}