import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'Fi Khidmatik <onboarding@resend.dev>',
      to: email,
      subject: 'Vérifiez votre email - Fi Khidmatik',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; margin-top: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10b981; margin: 0; font-size: 28px;">Fi Khidmatik</h1>
              <p style="color: #6b7280; margin-top: 5px;">Votre plateforme de services</p>
            </div>

            <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${fullName},</h2>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Merci de vous être inscrit sur Fi Khidmatik ! Pour activer votre compte,
              veuillez utiliser le code de vérification ci-dessous :
            </p>

            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Votre code de vérification</p>
              <h1 style="color: #ffffff; font-size: 42px; letter-spacing: 8px; margin: 0; font-weight: bold;">${code}</h1>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Ce code expire dans <strong>15 minutes</strong>.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Si vous n'avez pas créé de compte sur Fi Khidmatik, ignorez cet email.
            </p>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
              © 2024 Fi Khidmatik. Tous droits réservés.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'Fi Khidmatik <onboarding@resend.dev>',
      to: email,
      subject: 'Réinitialisation de mot de passe - Fi Khidmatik',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; margin-top: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10b981; margin: 0; font-size: 28px;">Fi Khidmatik</h1>
            </div>

            <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${fullName},</h2>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Vous avez demandé la réinitialisation de votre mot de passe.
              Utilisez le code ci-dessous pour continuer :
            </p>

            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Code de réinitialisation</p>
              <h1 style="color: #ffffff; font-size: 42px; letter-spacing: 8px; margin: 0; font-weight: bold;">${code}</h1>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Ce code expire dans <strong>15 minutes</strong>.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}
