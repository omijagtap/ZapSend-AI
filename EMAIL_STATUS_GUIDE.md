# Email Status Quick Reference Guide

## Understanding Email Status in ZapSend AI

When you send emails through ZapSend AI, each email will have one of three statuses in the campaign report:

---

## ✅ **SENT**

**What it means**: The email was successfully accepted by the SMTP server and queued for delivery.

**What happens next**: The SMTP server will attempt to deliver the email to the recipient's inbox.

**Important Note**: "Sent" means the server accepted the email, but it doesn't guarantee:
- The email reached the recipient's inbox
- The email didn't go to spam/junk folder
- The recipient received or opened the email

**What to do**: Nothing! The email is on its way.

---

## ❌ **FAILED**

**What it means**: The email was rejected by the SMTP server or encountered an error during sending.

**Common reasons**:
- Invalid or non-existent email address
- Email address is blocked or blacklisted
- Recipient's server rejected the email
- Network/connection error during sending
- Authentication issues

**What to do**:
1. Check the error message in the "Reason / Details" column
2. Verify the email address is correct and valid
3. If it's a network error, try resending
4. Remove invalid emails from your list

**Example error messages**:
- "Email rejected by server for: user@domain.com. The recipient address may be invalid or blocked."
- "Email sending timed out after 30 seconds"
- "Could not connect to the mail server"

---

## ⚠️ **SKIPPED**

**What it means**: The email was not sent because it had invalid or missing data.

**Common reasons**:
- Missing required fields (e.g., Name, Company) in personalized mode
- Invalid email format (e.g., "notanemail" instead of "user@domain.com")
- Empty email field in CSV

**What to do**:
1. Check the "Reason / Details" column to see which fields are missing
2. Update your CSV file with the correct data
3. Re-upload and send again

**Example error messages**:
- "Missing fields: Name, Company"
- "Email (Invalid)"

---

## 📊 Understanding the Numbers

In your campaign report, you'll see three key metrics:

### **Emails Sent**
- Number of emails successfully accepted by the SMTP server
- These emails are queued for delivery

### **Emails Failed**
- Number of emails rejected by the server or that encountered errors
- These emails were NOT sent

### **Emails Skipped**
- Number of rows in your CSV with invalid or missing data
- These emails were NOT attempted

---

## 🎯 Best Practices for High Success Rate

### 1. **Validate Your Email List**
- Use valid, verified email addresses
- Remove bounced emails from previous campaigns
- Avoid purchased or scraped email lists

### 2. **Test Before Sending**
- Always send a test email to yourself first
- Check how it looks in different email clients
- Verify all placeholders are replaced correctly

### 3. **Keep Your CSV Clean**
- Ensure all required fields are filled
- Use proper email format: `user@domain.com`
- Remove duplicate entries

### 4. **Monitor Your Reports**
- Check the detailed log after each campaign
- Identify patterns in failed emails
- Remove consistently failing addresses

### 5. **Avoid Spam Triggers**
- Use professional, clear subject lines
- Avoid excessive capitalization or exclamation marks
- Include a clear unsubscribe option
- Don't use misleading content

---

## 🔍 Troubleshooting Common Issues

### "Most emails show as Failed"
**Possible causes**:
- Invalid email addresses in your CSV
- Your email provider is blocking bulk sends
- Network connectivity issues

**Solutions**:
- Verify email addresses are correct
- Check your internet connection
- Try sending to a smaller batch first

### "Emails show as Sent but recipients didn't receive them"
**Possible causes**:
- Emails went to spam/junk folder
- Recipient's email filter blocked them
- Email bounced after SMTP acceptance

**Solutions**:
- Ask recipients to check spam folder
- Improve email content to avoid spam triggers
- Use a professional email domain
- Set up SPF, DKIM, and DMARC records

### "All emails show as Skipped"
**Possible causes**:
- CSV is missing required columns
- Email column has invalid format
- Required fields are empty

**Solutions**:
- Download the sample CSV and compare format
- Ensure 'Email' column exists and is spelled correctly
- Fill in all required fields for personalized mode

---

## 📧 SMTP Acceptance vs. Delivery

### What is SMTP Acceptance?
When you send an email, it first goes to an SMTP (Simple Mail Transfer Protocol) server. If the server accepts the email, it means:
- ✅ The email format is valid
- ✅ The recipient address appears valid
- ✅ The server will attempt to deliver it

### What is Delivery?
After SMTP acceptance, the email goes through several more steps:
1. The SMTP server tries to deliver to the recipient's mail server
2. The recipient's mail server checks spam filters
3. The email is placed in inbox or spam folder

### Why the Difference Matters
ZapSend AI can only confirm SMTP acceptance (step 1). We cannot confirm:
- Whether the email passed spam filters
- Whether it reached the inbox vs. spam folder
- Whether the recipient received or opened it

This is a limitation of email technology, not ZapSend AI.

---

## 🚀 Advanced: Improving Deliverability

### For Technical Users

If you want to improve the chances of your emails reaching inboxes:

1. **Set up SPF Record**: Authorizes your domain to send emails
2. **Set up DKIM**: Adds a digital signature to your emails
3. **Set up DMARC**: Tells recipients how to handle failed authentication
4. **Use a Professional Domain**: Avoid free email providers for bulk sending
5. **Warm Up Your Domain**: Start with small batches and gradually increase
6. **Monitor Reputation**: Use tools like Google Postmaster or Microsoft SNDS

### For Non-Technical Users

1. **Use a reputable email provider** (Gmail, Outlook, etc.)
2. **Send from a professional email address**
3. **Keep your content professional and relevant**
4. **Ask recipients to add you to their contacts**
5. **Include a clear unsubscribe option**

---

## 📞 Need Help?

If you're experiencing issues with email delivery:

1. Check the detailed log in your campaign report
2. Read the error messages carefully
3. Review this guide for solutions
4. Test with a small batch first
5. Contact support if issues persist

---

## Summary

| Status | Meaning | Action Required |
|--------|---------|----------------|
| ✅ Sent | Accepted by SMTP server | None - email is being delivered |
| ❌ Failed | Rejected or error occurred | Check error message, fix issue |
| ⚠️ Skipped | Invalid/missing data | Update CSV with correct data |

**Remember**: "Sent" means SMTP acceptance, not guaranteed inbox delivery!

---

*Last updated: December 11, 2025*
