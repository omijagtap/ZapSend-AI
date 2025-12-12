'use server';

import { optimizeSubjectLine, OptimizeSubjectLineInput } from '@/ai/flows/subject-line-optimization';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Email provider configurations
interface SMTPConfig {
    host: string;
    port: number;
}

const SMTP_CONFIGS: Record<string, SMTPConfig> = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
    },
    outlook: {
        host: 'smtp.office365.com',
        port: 587,
    },
    hotmail: {
        host: 'smtp.office365.com',
        port: 587,
    },
    live: {
        host: 'smtp.office365.com',
        port: 587,
    },
    upgrad: {
        host: 'smtp.office365.com',
        port: 587,
    },
};

/**
 * Detects the email provider from the email address and returns appropriate SMTP configuration
 */
function getSMTPConfig(email: string): SMTPConfig {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
        // Fallback to environment variables or Outlook default
        return {
            host: process.env.SMTP_SERVER || 'smtp.office365.com',
            port: Number(process.env.SMTP_PORT || '587'),
        };
    }

    // Extract the provider name from the domain (e.g., gmail.com -> gmail)
    const provider = domain.split('.')[0];

    // Check if we have a configuration for this provider
    if (SMTP_CONFIGS[provider]) {
        return SMTP_CONFIGS[provider];
    }

    // For custom domains or unknown providers, use environment variables or defaults
    return {
        host: process.env.SMTP_SERVER || 'smtp.office365.com',
        port: Number(process.env.SMTP_PORT || '587'),
    };
}


async function setSessionCookie(email: string, appPassword: string) {
    const cookieValue = JSON.stringify({ email, appPassword, loginTime: new Date().toISOString() });
    const cookieStore = await cookies();
    cookieStore.set('SENDER_SESSION', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
}

export async function getServerSession(): Promise<{ email: string; loginTime: string } | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('SENDER_SESSION')?.value;
    if (!cookie) return null;
    try {
        const session = JSON.parse(cookie);
        return { email: session.email, loginTime: session.loginTime };
    } catch {
        return null;
    }
}

export async function verifyCredentialsAndLogin(email: string, appPassword: string): Promise<{ success: boolean; error?: string; }> {

    // Get SMTP configuration based on email provider
    const smtpConfig = getSMTPConfig(email);

    // Log configuration for debugging (without sensitive data)
    console.log('[Vercel Debug] SMTP Config:', {
        host: smtpConfig.host,
        port: smtpConfig.port,
        email: email.replace(/(.{3}).*(@.*)/, '$1***$2') // Partially hide email
    });

    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false, // Use STARTTLS
        requireTLS: true, // Force TLS
        auth: {
            user: email,
            pass: appPassword,
        },
        connectionTimeout: 15000, // Increased to 15 seconds for Vercel
        greetingTimeout: 15000, // Increased to 15 seconds for Vercel
        socketTimeout: 20000, // Added socket timeout for Vercel
        logger: process.env.NODE_ENV === 'development', // Enable logging in dev
        debug: process.env.NODE_ENV === 'development', // Enable debug in dev
    });

    try {
        const verificationSubject = "✓ Welcome to ZapSend AI - Account Verified!";
        const verificationHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 40px 20px;">
                <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 48px; margin-bottom: 15px;">✓</div>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">Account Verified!</h1>
                    </div>
                    <p style="margin: 20px 0; font-size: 16px; color: #555; line-height: 1.6;">Hi <strong>${email}</strong>,</p>
                    <p style="margin: 20px 0; font-size: 15px; color: #666; line-height: 1.7;">Welcome to <strong>ZapSend AI</strong>! Your email account has been successfully authenticated and verified. You're all set to start crafting and sending professional email campaigns.</p>
                    <div style="background: #f0f4ff; border-left: 4px solid #6366f1; padding: 16px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #4f46e5; font-weight: 600;">🚀 You can now:</p>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #555; line-height: 1.8;">
                            <li>Import your contact lists via CSV</li>
                            <li>Create personalized email templates</li>
                            <li>Optimize subject lines with AI assistance</li>
                            <li>Launch your email campaigns instantly</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.APP_URL || 'https://zapsend-ai.app'}/login" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; transition: transform 0.2s;">Get Started →</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="margin: 15px 0; font-size: 13px; color: #999; line-height: 1.6;">If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
                    <p style="margin: 20px 0 0 0; font-size: 13px; color: #aaa;">Best regards,<br/><strong style="color: #1a1a1a;">The ZapSend AI Team</strong></p>
                </div>
                <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">© 2025 ZapSend AI. All rights reserved.</p>
            </div>`;

        const result = await sendEmailInternal(transporter, {
            to: email,
            subject: verificationSubject,
            html: verificationHtml,
            from: email,
        });

        // Verify that the email was accepted by the SMTP server
        if (result.rejected && result.rejected.length > 0) {
            return {
                success: false,
                error: `Verification email was rejected by the server. The email address may be invalid or blocked: ${result.rejected.join(', ')}`
            };
        }

        if (!result.accepted || result.accepted.length === 0) {
            return {
                success: false,
                error: 'Verification email was not accepted by the server. Please check your email address and try again.'
            };
        }

        await setSessionCookie(email, appPassword);

        return { success: true };

    } catch (error: any) {
        console.error("Verification failed:", error);
        let errorMessage = 'An unknown error occurred during verification.';
        if (error.code === 'EAUTH') {
            errorMessage = 'Invalid email or app password. Please check your credentials and ensure app passwords are set up correctly in your email provider\'s security settings.';
        } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
            errorMessage = 'Could not connect to the mail server. It might be a network issue or the server is busy. Please try again later.';
        }
        return { success: false, error: errorMessage };
    }
}

export async function getUserSession(): Promise<{ email: string; name?: string; } | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('SENDER_SESSION')?.value;
    if (!cookie) return null;
    try {
        const { email } = JSON.parse(cookie);
        if (!email) return null;
        return { email, name: email.split('@')[0] };
    } catch (error) {
        console.error('Error getting user session:', error);
        return null;
    }
}

export async function updateUserName(name: string): Promise<{ success: boolean }> {
    const session = await getVerifiedSender();
    if (!session) {
        throw new Error("User not authenticated");
    }

    // For now, just return success without storing in Firestore
    // to avoid Firebase permission issues
    console.log('User name update requested for:', session.email, 'name:', name);

    revalidatePath('/', 'layout');
    return { success: true };
}


export async function getVerifiedSender(): Promise<{ email: string; appPassword: string } | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('SENDER_SESSION')?.value;
    if (!cookie) return undefined;
    try {
        const { email, appPassword } = JSON.parse(cookie);
        if (!email || !appPassword) return undefined;
        return { email, appPassword };
    } catch {
        // Corrupted cookie.
        return undefined;
    }
}

export async function getSubjectSuggestions(input: OptimizeSubjectLineInput) {
    try {
        const result = await optimizeSubjectLine(input);
        return result.suggestedSubjectLines;
    } catch (error) {
        console.error('Error getting subject suggestions:', error);
        throw new Error('Failed to generate subject suggestions. Please try again.');
    }
}

interface AttachmentData {
    filename: string;
    content: string; // base64 encoded content
    contentType: string;
    cid?: string; // For embedded images
}

interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: AttachmentData[];
}

async function sendEmailInternal(transporter: nodemailer.Transporter, params: SendEmailParams & { from: string }): Promise<{ messageId?: string; accepted?: string[]; rejected?: string[]; }> {
    const { to, subject, html, attachments = [], from } = params;

    // Extract name from email (part before @)
    const senderName = from.split('@')[0];

    const mailOptions: nodemailer.SendMailOptions = {
        from: `${senderName} <${from}>`,
        to: Array.isArray(to) ? undefined : to,
        bcc: Array.isArray(to) ? to.join(', ') : undefined,
        subject: subject,
        html: html,
        attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content,
            encoding: 'base64',
            contentType: att.contentType,
            cid: att.cid,
        }))
    };

    // Verify connection before sending
    await transporter.verify();

    // Send email and capture response info
    const info = await transporter.sendMail(mailOptions);

    // Return detailed response information for better tracking
    return {
        messageId: info.messageId,
        accepted: info.accepted as string[] | undefined,
        rejected: info.rejected as string[] | undefined,
    };
}


export async function sendEmail({ to, subject, html, attachments = [] }: SendEmailParams): Promise<{ success: boolean, error?: string }> {
    const senderSession = await getVerifiedSender();

    if (!senderSession?.email || !senderSession?.appPassword) {
        return { success: false, error: 'User not logged in. Please log in again.' };
    }
    const { email: senderEmail, appPassword: authPass } = senderSession;

    // Get SMTP configuration based on email provider
    const smtpConfig = getSMTPConfig(senderEmail);

    // Log for debugging on Vercel
    console.log('[Vercel Debug] Sending email with config:', {
        host: smtpConfig.host,
        port: smtpConfig.port,
        recipientCount: Array.isArray(to) ? to.length : 1
    });

    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false, // Use STARTTLS
        requireTLS: true,
        auth: {
            user: senderEmail,
            pass: authPass,
        },
        connectionTimeout: 15000, // Increased to 15 seconds for Vercel
        greetingTimeout: 15000, // Increased to 15 seconds for Vercel
        socketTimeout: 25000, // Increased to 25 seconds for Vercel
        pool: true, // Use connection pooling for better performance
        maxConnections: 20, // Allow up to 20 concurrent connections for maximum speed
        maxMessages: 100, // Reuse connection for up to 100 messages
        logger: process.env.NODE_ENV === 'development', // Enable logging in dev
        debug: process.env.NODE_ENV === 'development', // Enable debug in dev
    });

    const MAX_RETRIES = 2;
    let lastError: any;

    // Retry logic for transient failures
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            // Add timeout wrapper to prevent indefinite hanging
            const sendPromise = sendEmailInternal(transporter, { to, subject, html, attachments, from: senderEmail });
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Email send operation timed out after 25 seconds')), 25000);
            });

            const result = await Promise.race([sendPromise, timeoutPromise]);

            // Check if any emails were rejected by the SMTP server
            if (result.rejected && result.rejected.length > 0) {
                transporter.close();
                return {
                    success: false,
                    error: `Email rejected by server for: ${result.rejected.join(', ')}. The recipient address may be invalid or blocked.`
                };
            }

            // Verify that emails were accepted
            if (Array.isArray(to)) {
                // For BCC mode, check if all emails were accepted
                const expectedCount = to.length;
                const acceptedCount = result.accepted?.length || 0;

                if (acceptedCount < expectedCount) {
                    transporter.close();
                    return {
                        success: false,
                        error: `Only ${acceptedCount} out of ${expectedCount} emails were accepted by the server. Some recipients may be invalid.`
                    };
                }
            } else {
                // For single email, verify it was accepted
                if (!result.accepted || result.accepted.length === 0) {
                    transporter.close();
                    return {
                        success: false,
                        error: 'Email was not accepted by the server. The recipient address may be invalid.'
                    };
                }
            }

            // Close transporter after successful send
            transporter.close();
            return { success: true };
        } catch (error: any) {
            lastError = error;
            console.error(`Error sending email (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);

            // Don't retry on authentication errors
            if (error.code === 'EAUTH') {
                transporter.close();
                return {
                    success: false,
                    error: 'Authentication error. Your app password might have changed. Please log in again.'
                };
            }

            // Retry on transient errors
            if (attempt < MAX_RETRIES && (
                error.code === 'ECONNRESET' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ESOCKET' ||
                error.message?.includes('timeout')
            )) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }

            // Don't retry on other errors
            break;
        }
    }

    // Close transporter after all attempts
    transporter.close();

    // Return final error
    let errorMessage = 'Failed to send email.';
    if (lastError?.code === 'ECONNRESET' || lastError?.code === 'ETIMEDOUT' || lastError?.code === 'ESOCKET') {
        errorMessage = 'Could not connect to the mail server. Please check your network connection.';
    } else if (lastError?.message) {
        errorMessage = lastError.message;
    }
    return { success: false, error: errorMessage };
}

export async function logout() {
    // Delete cookie with explicit options
    const cookieStore = await cookies();
    cookieStore.set('SENDER_SESSION', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Immediately expire
    });
    revalidatePath('/', 'layout');
}
