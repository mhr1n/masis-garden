import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, email, orderId, items, totalAmount, discountAmount, paymentMethod, address, city } = body;

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 });
    }

    const finalTotal = totalAmount - (discountAmount || 0);

    const itemsHtml = (items || []).map((item: any) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #E8F0E2;">
          <div style="font-weight: 600; color: #1a2018;">${item.name}</div>
          ${item.selectedSize ? `<div style="font-size: 12px; color: #6a7a65;">Size: ${item.selectedSize}</div>` : ''}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #E8F0E2; text-align: center; color: #4a5c3f;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #E8F0E2; text-align: right; font-weight: 600; color: #1a2018;">
          ${Number(item.price).toLocaleString()} ֏
        </td>
      </tr>
    `).join('');

    const paymentLabel = paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Card Payment' : 'Bank Transfer';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation – Masis Garden</title>
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

          <!-- Success Banner -->
          <tr>
            <td style="background: #c5d8b3; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #2d3d26; font-size: 15px; font-weight: 600;">
                ✅ &nbsp; Your order has been confirmed!
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 36px 40px 24px;">
              <h2 style="margin: 0 0 12px; color: #1a2018; font-size: 22px; font-weight: 700;">
                Thank you, ${customerName}! 🎉
              </h2>
              <p style="margin: 0; color: #5a6a55; font-size: 15px; line-height: 1.6;">
                We're thrilled to receive your order. Our team is already preparing your plants with care and love. 
                You'll be notified once your order is on its way!
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f7faf5; border-radius: 12px; border: 1px solid #E8F0E2; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #E8F0E2;">
                    <span style="color: #6a7a65; font-size: 13px;">Order ID</span>
                    <div style="color: #1a2018; font-weight: 700; font-size: 15px; margin-top: 2px;">${orderId}</div>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #E8F0E2; border-left: 1px solid #E8F0E2;">
                    <span style="color: #6a7a65; font-size: 13px;">Delivery Address</span>
                    <div style="color: #1a2018; font-weight: 600; font-size: 14px; margin-top: 2px;">${address}, ${city}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;" colspan="2">
                    <span style="color: #6a7a65; font-size: 13px;">Payment Method</span>
                    <div style="color: #1a2018; font-weight: 600; font-size: 14px; margin-top: 2px;">${paymentLabel}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <h3 style="margin: 0 0 12px; color: #1a2018; font-size: 16px; font-weight: 700;">📦 Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E8F0E2; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background: #4a5c3f;">
                    <th style="padding: 12px 16px; text-align: left; color: #fff; font-size: 13px; font-weight: 600;">Product</th>
                    <th style="padding: 12px 16px; text-align: center; color: #fff; font-size: 13px; font-weight: 600;">Qty</th>
                    <th style="padding: 12px 16px; text-align: right; color: #fff; font-size: 13px; font-weight: 600;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${discountAmount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a6a55; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #5a6a55; font-size: 14px;">${Number(totalAmount).toLocaleString()} ֏</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #e07070; font-size: 14px;">Discount</td>
                  <td style="padding: 8px 0; text-align: right; color: #e07070; font-size: 14px;">-${Number(discountAmount).toLocaleString()} ֏</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 14px 20px; background: #4a5c3f; border-radius: 10px 0 0 10px;">
                    <span style="color: #ffffff; font-size: 16px; font-weight: 700;">Total Amount</span>
                  </td>
                  <td style="padding: 14px 20px; background: #4a5c3f; border-radius: 0 10px 10px 0; text-align: right;">
                    <span style="color: #c5d8b3; font-size: 18px; font-weight: 800;">${Number(finalTotal).toLocaleString()} ֏</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f7faf5; padding: 28px 40px; text-align: center; border-top: 1px solid #E8F0E2;">
              <p style="margin: 0 0 8px; color: #5a6a55; font-size: 14px; line-height: 1.6;">
                Questions? Contact us anytime.<br/>
                <a href="https://www.masisgarden.com" style="color: #4a5c3f; font-weight: 700; text-decoration: none;">www.masisgarden.com</a>
              </p>
              <p style="margin: 16px 0 0; color: #9aaa90; font-size: 12px;">
                © 2026 Masis Garden, Yerevan, Armenia. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: 'Masis Garden <onboarding@resend.dev>',
      to: [email],
      subject: `✅ Order Confirmed – ${orderId} | Masis Garden`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Email route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
