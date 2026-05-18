import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey && !apiKey.startsWith('REPLACE_ME')
  ? new Resend(apiKey)
  : null

export async function sendBookingConfirmation(email: string, booking: {
  customerName: string
  serviceName: string
  startTime: Date
  endTime: Date
}) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping confirmation email')
    return
  }
  try {
    const gcLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`True Stylez – ${booking.serviceName}`)}&dates=${encodeURIComponent(booking.startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' + '/' + booking.endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z')}&location=332+Congress+St+Troy+NY+12180`

     await resend.emails.send({
       from: 'True Stylez Hair Studio <bookings@truestylez.com>',
       to: email,
       subject: 'Your Appointment is Confirmed! ✂️',
       html: `
         <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
           <img src="https://truestylez.com/logo.svg" alt="True Stylez Hair Studio Logo" width="80" height="80" style="margin-bottom: 20px;">
           <h1 style="color: #d94600; font-family: 'Montserrat', sans-serif;">True Stylez Hair Studio</h1>
           <p>Hey <strong>${booking.customerName}</strong>,</p>
           <p>Your appointment has been <strong>confirmed</strong>!</p>
           <div style="background: #f5f7fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
             <h3 style="margin: 0 0 10px 0; color: #1a1f2e;">${booking.serviceName}</h3>
             <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
             <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${booking.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
             <p style="margin: 5px 0;"><strong>Location:</strong> 332 Congress St, Troy, NY 12180</p>
           </div>
           <a href="${gcLink}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #d94600; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">📅 Add to Google Calendar</a>
           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
           <p style="font-size: 12px; color: #999;">J The Barber – precision cuts, sharp style.</p>
         </div>
       `,
     })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
