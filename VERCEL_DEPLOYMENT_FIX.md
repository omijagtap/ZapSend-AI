# Vercel Deployment Fix Guide

## Issues Fixed

### 1. **SSL Root CAs Package Removed**
- ❌ **Problem**: The `ssl-root-cas` package doesn't work in Vercel's serverless environment
- ✅ **Solution**: Removed the package and its imports. Node.js built-in SSL handling is sufficient.

### 2. **Timeout Configuration**
- ❌ **Problem**: Default timeouts were too short for Vercel's serverless functions
- ✅ **Solution**: 
  - Increased connection timeout to 15 seconds
  - Increased greeting timeout to 15 seconds
  - Increased socket timeout to 25 seconds
  - Added `vercel.json` with 60-second max duration for functions

### 3. **SMTP Configuration**
- ✅ **Added**: UpGrad domain to SMTP configurations
- ✅ **Configured**: Automatic detection of Office365 SMTP for UpGrad emails

### 4. **Logging & Debugging**
- ✅ **Added**: Debug logging for Vercel environment
- ✅ **Added**: Better error messages with detailed information

### 5. **Next.js Configuration**
- ✅ **Added**: `serverComponentsExternalPackages: ['nodemailer']` to ensure nodemailer works in serverless

## Deployment Steps

### Step 1: Commit Your Changes
```bash
git add .
git commit -m "Fix: Vercel serverless email sending issues"
git push origin main
```

### Step 2: Configure Vercel Environment Variables
Go to your Vercel dashboard and add these environment variables:

**Required Variables:**
- `GEMINI_API_KEY` - Your Google Gemini API key
- `NODE_ENV` - Set to `production`
- `APP_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)

**Optional (for custom SMTP):**
- `SMTP_SERVER` - Default: `smtp.office365.com`
- `SMTP_PORT` - Default: `587`

### Step 3: Deploy to Vercel
```bash
# If you haven't linked to Vercel yet
vercel

# Or if already linked
vercel --prod
```

### Step 4: Test on Vercel
1. Go to your deployed app
2. Login with: `intlesgcidba@upgrad.com`
3. Use app password: `fvvcmkbfppxwttsp`
4. Try sending a test email

## What Changed in the Code

### `src/app/actions.ts`
- ❌ Removed `ssl-root-cas` import and usage
- ✅ Added UpGrad to SMTP configs
- ✅ Increased timeouts for Vercel
- ✅ Added debug logging
- ✅ Added logger and debug options for development

### `next.config.ts`
- ✅ Added `serverComponentsExternalPackages: ['nodemailer']`

### `vercel.json` (NEW)
- ✅ Set max duration to 60 seconds for all functions
- ✅ Set NODE_ENV to production

### `package.json`
- ❌ Removed `ssl-root-cas` dependency

## Testing Locally

Before deploying, test locally:

```bash
# Run the test script
node test-gmail-smtp.js

# Start the dev server
npm run dev
```

## Common Issues & Solutions

### Issue: "Connection timeout"
**Solution**: The new timeout settings should fix this. If it persists, check your network/firewall.

### Issue: "EAUTH - Authentication failed"
**Solution**: 
1. Verify the app password is correct
2. Ensure 2FA is enabled on the UpGrad account
3. Generate a new app password if needed

### Issue: "Module not found: ssl-root-cas"
**Solution**: Run `npm install` to update dependencies

### Issue: "Function timeout"
**Solution**: The `vercel.json` sets max duration to 60s. For hobby plans, this is the limit.

## Vercel Function Limits

**Hobby Plan:**
- Max duration: 10 seconds (we set 60s but it will cap at 10s)
- Max payload: 4.5 MB

**Pro Plan:**
- Max duration: 60 seconds
- Max payload: 4.5 MB

If you're on the Hobby plan and sending many emails, consider upgrading to Pro.

## Monitoring

After deployment, check Vercel logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. View real-time logs

Look for `[Vercel Debug]` messages to see SMTP configuration and connection details.

## Next Steps

1. ✅ Commit and push changes
2. ✅ Set environment variables in Vercel
3. ✅ Deploy to Vercel
4. ✅ Test email sending on live site
5. ✅ Monitor logs for any issues

## Support

If issues persist:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test locally first with `node test-gmail-smtp.js`
4. Check if your Vercel plan supports longer function durations

---

**Last Updated**: December 12, 2025
**Status**: ✅ Ready for deployment
