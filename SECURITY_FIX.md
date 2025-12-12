# 🚨 SECURITY FIX - EXPOSED CREDENTIALS

## ⚠️ CRITICAL: Credentials Were Exposed on GitHub

The file `test-gmail-smtp.js` contained hardcoded credentials that were pushed to GitHub:
- Email: `int***@upgrad.com` (redacted)
- App Password: `fvv***ttsp` (redacted)

## ✅ Immediate Actions Taken

1. ✅ Removed hardcoded credentials from `test-gmail-smtp.js`
2. ✅ Updated file to use environment variables instead
3. ✅ Ready to remove from Git history

## 🔐 REQUIRED: Regenerate App Password

**YOU MUST DO THIS IMMEDIATELY:**

1. Go to: https://account.microsoft.com/security
2. Find "App passwords" section
3. **Delete** the old/exposed app password
4. **Generate** a new app password
5. Save the new password in your `.env` file

## 📝 How to Use the Test Script Now

### Step 1: Update Your `.env` File

Add these lines to your `.env` file (which is NOT committed to Git):

```env
TEST_EMAIL=your-email@upgrad.com
TEST_APP_PASSWORD=your-new-app-password-here
```

### Step 2: Run the Test

```bash
node test-gmail-smtp.js
```

The script will now read credentials from `.env` file instead of having them hardcoded.

## 🧹 Clean Git History (Optional but Recommended)

To completely remove the exposed credentials from Git history:

```bash
# Install BFG Repo-Cleaner (if not already installed)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Or use git filter-branch (built-in but slower)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch test-gmail-smtp.js" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to GitHub (WARNING: This rewrites history)
git push origin --force --all
```

**⚠️ WARNING**: This rewrites Git history. Only do this if you understand the implications.

## 🔒 Security Best Practices Going Forward

### ✅ DO:
- Store credentials in `.env` files (gitignored)
- Use environment variables
- Regenerate passwords if exposed
- Use different passwords for different services

### ❌ DON'T:
- Hardcode credentials in source files
- Commit `.env` files to Git
- Share credentials in plain text
- Reuse passwords across services

## 📋 Checklist

- [ ] Regenerate the app password at Microsoft
- [ ] Update `.env` file with new credentials
- [ ] Test email sending with new credentials
- [ ] (Optional) Clean Git history
- [ ] Verify new credentials work on Vercel

## 🆘 If You Need Help

If the old credentials were already used maliciously:
1. Change your Microsoft account password
2. Enable 2FA if not already enabled
3. Review recent account activity
4. Contact Microsoft security if needed

---

**Status**: 🔴 URGENT - Regenerate app password immediately
**Last Updated**: December 12, 2025
