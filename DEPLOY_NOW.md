# 🚀 Quick Deployment Checklist

## ✅ Changes Made (All Complete)

1. ✅ Removed `ssl-root-cas` package (incompatible with Vercel)
2. ✅ Added UpGrad domain to SMTP configurations
3. ✅ Increased timeouts for Vercel serverless (15s connection, 25s socket)
4. ✅ Added debug logging for troubleshooting
5. ✅ Created `vercel.json` with 60s function timeout
6. ✅ Updated `next.config.ts` with `serverExternalPackages`
7. ✅ Build tested successfully ✅

## 📋 Deploy to Vercel Now

### Step 1: Set Environment Variables in Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `APP_URL` | `https://your-app.vercel.app` | ✅ Yes |

### Step 2: Deploy

```bash
# Commit your changes
git add .
git commit -m "fix: Vercel serverless email sending issues"
git push origin main
```

Vercel will automatically deploy when you push to main branch.

**OR** deploy manually:

```bash
vercel --prod
```

### Step 3: Test Your Deployment

1. Visit your deployed app
2. Login with your UpGrad email credentials:
   - Email: `your-email@upgrad.com`
   - App Password: `your-app-password-here`
3. Send a test email
4. Check Vercel logs if there are issues

## 🔍 Monitoring

### View Logs in Vercel:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" or "Logs"
4. Look for `[Vercel Debug]` messages

### What to Look For:
- ✅ `[Vercel Debug] SMTP Config: { host: 'smtp.office365.com', port: 587 }`
- ✅ `[Vercel Debug] Sending email with config:`
- ✅ Email sent successfully

## ⚠️ Troubleshooting

### Issue: Function timeout
**Solution**: Upgrade to Vercel Pro (Hobby plan has 10s limit, we need 60s)

### Issue: Still not working
**Check**:
1. Environment variables are set correctly in Vercel
2. App password is correct
3. Check Vercel function logs for errors
4. Verify SMTP config in logs shows `smtp.office365.com`

## 📊 Vercel Plan Limits

| Plan | Max Function Duration | Recommended For |
|------|----------------------|-----------------|
| Hobby | 10 seconds | Testing only |
| Pro | 60 seconds | Production ✅ |

**Note**: For sending emails, you'll need the Pro plan for reliable operation.

## 🎯 Next Steps After Deployment

1. Test email sending on live site
2. Monitor logs for any errors
3. If issues persist, check the `VERCEL_DEPLOYMENT_FIX.md` guide
4. Consider upgrading to Vercel Pro if on Hobby plan

---

**Status**: ✅ Ready to Deploy
**Last Updated**: December 12, 2025
