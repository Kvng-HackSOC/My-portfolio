# Email Configuration Guide

## Option 1: Gmail (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. In the same Security section, scroll down to **App passwords**
2. If you don't see "App passwords", you might need to:
   - Click on "2-Step Verification" again
   - Scroll to the bottom and click "App passwords"
3. You might need to sign in again
4. Select **Mail** from the first dropdown
5. Select **Other (custom name)** from the second dropdown
6. Enter "Portfolio Contact Form" as the name
7. Click **Generate**
8. Copy the 16-character password (ignore spaces)

**⚠️ IMPORTANT:** Gmail requires App Passwords when 2FA is enabled. Regular passwords won't work for SMTP!

### Step 3: Update Environment Variables
Update your `.env` file:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop  # The app password you just generated
```

## Option 2: SendGrid (Easier Setup)

### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com) and create a free account
2. Verify your email

### Step 2: Create API Key
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Give it a name like "Portfolio Contact"
4. Select **Full Access** or **Restricted Access** with Mail Send permissions
5. Copy the API key

### Step 3: Update Environment Variables
```env
EMAIL_USER=apikey
EMAIL_PASS=SG.your-sendgrid-api-key-here
```

### Step 4: Update Contact API
Change the transporter configuration in `src/app/api/contact/route.ts`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## Option 3: Mailgun (Alternative)

### Step 1: Create Mailgun Account
1. Go to [Mailgun](https://www.mailgun.com) and create a free account
2. Verify your domain or use the sandbox domain

### Step 2: Get SMTP Credentials
1. Go to **Sending** → **Domains**
2. Click on your domain
3. Go to **SMTP Credentials**
4. Copy the SMTP username and password

### Step 3: Update Environment Variables
```env
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASS=your-mailgun-smtp-password
```

## Testing Email Configuration

1. Restart your development server: `npm run dev`
2. Fill out the contact form on your portfolio
3. Submit the form
4. Check your email inbox for the contact message

## Troubleshooting

- **"Missing credentials" error**: Check that EMAIL_USER and EMAIL_PASS are set correctly
- **"Authentication failed"**: For Gmail, make sure you're using an App Password, not your regular password
- **Emails not arriving**: Check your spam folder and verify the email address in the `to` field

## Current Fallback Behavior

If email credentials are not configured, the contact form will automatically fall back to opening the user's email client with a pre-filled email. This ensures the contact form always works, even without email service configuration.