import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema } from '@/lib/validation';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Initialize variables to prevent TypeScript errors
  let name = '';
  let email = '';
  let subject = '';
  let message = '';

  try {
    logger.apiRequest('POST', '/api/contact');

    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn('Contact form validation failed', {
        errors: validationResult.error.issues,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    ({ name, email, subject, message } = validationResult.data);

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-gmail-app-password-here') {
      // Fallback: create mailto link for client-side email
      const mailtoLink = `mailto:oba198175@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      logger.info('Email credentials not configured, using mailto fallback', { email });
      return NextResponse.json({
        message: 'Email credentials not configured. Opening email client...',
        mailto: mailtoLink,
        fallback: true
      });
    }

    // Create a transporter with configured credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: email,
      to: 'oba198175@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    const duration = Date.now() - startTime;
    logger.apiRequest('POST', '/api/contact', 200, duration);
    logger.info('Contact form submitted successfully', { email, subject });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error as Error;
    logger.apiError('POST', '/api/contact', err, 500);

    // Check if it's an authentication error - fall back to mailto
    if (err.message.includes('Authentication failed') ||
        err.message.includes('Invalid login') ||
        err.message.includes('Missing credentials') ||
        err.message.includes('535') ||
        err.message.includes('534')) {

      logger.warn('SMTP authentication failed, falling back to mailto', { error: err.message });

      // Create mailto fallback
      const mailtoLink = `mailto:oba198175@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      return NextResponse.json({
        message: 'Email service unavailable. Opening email client...',
        mailto: mailtoLink,
        fallback: true
      });
    }

    // For other errors, return the error
    return NextResponse.json(
      { error: 'Failed to send email. Please try again or contact directly.' },
      { status: 500 }
    );
  }
}