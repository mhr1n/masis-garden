import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, message, emails, promoCode, promoDiscount, senderName } = body;

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: 'No recipients provided' }, { status: 400 });
    }

    const promoSection = promoCode ? `
      <!-- Promo Code -->
      <tr>
        <td style="padding: 0 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #4a5c3f, #2d3d26); border-radius: 16px; overflow: hidden;">
            <tr>
              <td style="padding: 28px; text-align: center;">
                <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 10px; letter-spacing: 1px; text-transform: uppercase;">🎁 Special Offer / Հատուկ Առաջարկ / Специальное Предложение</div>
                <div style="font-size: 36px; font-weight: 900; color: #c5d8b3; letter-spacing: 6px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 14px 28px; border-radius: 10px; display: inline-block; border: 2px dashed rgba(255,255,255,0.3);">
                  ${promoCode}
                </div>
                ${promoDiscount ? `<div style="margin-top: 12px; color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600;">${promoDiscount}% discount on your next order</div>` : ''}
                <div style="margin-top: 10px; color: rgba(255,255,255,0.5); font-size: 12px;">Enter the code at checkout • Введите код при оформлении • Մուտքագրեք կոդը վճարման ժամանակ</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    ` : '';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4ed; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ed; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a5c3f 0%, #2d3d26 100%); padding: 40px 40px 32px; text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">🌿</div>
              <h1 style="color: #ffffff; margin: 0 0 4px; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Masis Garden</h1>
              <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 14px;">Bringing nature closer to you</p>
            </td>
          </tr>

          <!-- Subject Banner -->
          <tr>
            <td style="background: #c5d8b3; padding: 18px 40px; text-align: center;">
              <p style="margin: 0; color: #2d3d26; font-size: 16px; font-weight: 700;">${subject}</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 36px 40px 28px;">
              <div style="color: #3a4d35; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>
            </td>
          </tr>

          ${promoSection}

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 36px; text-align: center;">
              <a href="https://www.masisgarden.com" style="display: inline-block; background: linear-gradient(135deg, #4a5c3f, #6a8f5a); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 15px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(74,92,63,0.35);">
                🌿 Visit Masis Garden
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f7faf5; padding: 24px 40px; text-align: center; border-top: 1px solid #E8F0E2;">
              <p style="margin: 0 0 6px; color: #5a6a55; font-size: 13px;">
                ${senderName || 'Masis Garden Team'} &nbsp;•&nbsp;
                <a href="https://www.masisgarden.com" style="color: #4a5c3f; font-weight: 600; text-decoration: none;">masisgarden.com</a>
              </p>
              <p style="margin: 8px 0 0; color: #9aaa90; font-size: 11px;">
                © 2026 Masis Garden, Yerevan, Armenia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send in batches using Resend (max 50 per call in free plan)
    const results = [];
    const batchSize = 50;
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const { data, error } = await resend.emails.send({
        from: 'Masis Garden <onboarding@resend.dev>',
        to: batch,
        subject,
        html,
      });
      if (error) results.push({ batch: i, error });
      else results.push({ batch: i, success: true, data });
    }

    return NextResponse.json({ success: true, sent: emails.length, results });
  } catch (err) {
    console.error('Bulk email error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
