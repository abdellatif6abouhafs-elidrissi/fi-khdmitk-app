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
  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_5wurgdr';
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_vrng9is';
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '7y9-f1BpOUAQvDxyc';
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'MWx0VHBeRgFX_F6SMFdAS';

  console.log('=== SENDING VERIFICATION EMAIL ===');
  console.log('To:', email);
  console.log('Service ID:', EMAILJS_SERVICE_ID);
  console.log('Template ID:', EMAILJS_TEMPLATE_ID);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: email,
          to_name: fullName,
          verification_code: code,
        },
      }),
    });

    console.log('EmailJS response status:', response.status);
    const responseText = await response.text();
    console.log('EmailJS response:', responseText);

    if (response.ok || response.status === 200) {
      console.log('=== EMAIL SENT SUCCESSFULLY ===');
      return { success: true };
    } else {
      console.error('=== EMAIL SEND FAILED ===', responseText);
      return { success: false, error: responseText || 'Failed to send email' };
    }
  } catch (error: any) {
    console.error('=== EMAIL ERROR ===', error);
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
