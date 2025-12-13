// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email using EmailJS REST API
export async function sendVerificationEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  // Get environment variables at runtime (important for Vercel serverless)
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error('EMAIL CONFIG MISSING:', { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey, privateKey: !!privateKey });
    return { success: false, error: 'Email configuration missing' };
  }

  console.log('Sending email to:', email);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email,
          to_name: fullName,
          verification_code: code,
        },
      }),
    });

    const responseText = await response.text();
    console.log('EmailJS Response:', response.status, responseText);

    if (response.ok || response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: responseText || 'Failed to send email' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  return sendVerificationEmail(email, code, fullName);
}
