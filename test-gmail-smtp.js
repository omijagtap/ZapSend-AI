const nodemailer = require('nodemailer');

// Test Gmail credentials
const email = 'harshmoremm2195@gmail.com';
const appPassword = 'qtoaltkugvhiqhkq';

console.log('Testing Gmail SMTP connection...');
console.log('Email:', email);
console.log('Using SMTP: smtp.gmail.com:587');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
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
