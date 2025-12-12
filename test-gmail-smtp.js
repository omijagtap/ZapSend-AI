require('dotenv').config();
const nodemailer = require('nodemailer');

// IMPORTANT: Never commit credentials to Git!
// Set these in your .env file (which is gitignored)
const email = process.env.TEST_EMAIL || 'your-email@example.com';
const appPassword = process.env.TEST_APP_PASSWORD || 'your-app-password-here';

console.log('Testing UpGrad (Office365) SMTP connection...');
console.log('Email:', email);
console.log('Using SMTP: smtp.office365.com:587');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: email,
        pass: appPassword,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
});

// Test the connection
transporter.verify()
    .then(() => {
        console.log('✅ SUCCESS! SMTP connection verified');
        console.log('The credentials are correct and Gmail SMTP is working!');

        // Send a test email
        return transporter.sendMail({
            from: `Test <${email}>`,
            to: email,
            subject: 'Test Email - ZapSend AI',
            text: 'This is a test email to verify Gmail SMTP is working correctly.',
            html: '<p>This is a test email to verify Gmail SMTP is working correctly.</p>',
        });
    })
    .then((info) => {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ SMTP connection failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\n⚠️ Authentication failed - Invalid email or app password');
            console.error('Please check:');
            console.error('1. The email address is correct');
            console.error('2. You have enabled 2-Step Verification in Gmail');
            console.error('3. You have generated an App Password (not regular password)');
            console.error('4. The app password is typed correctly (16 characters, no spaces)');
        }

        process.exit(1);
    });
