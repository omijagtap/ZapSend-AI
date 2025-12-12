# 🔍 Root Cause Analysis (RCA) - Exposed Credentials on GitHub

**Date**: December 12, 2025  
**Severity**: 🔴 CRITICAL  
**Status**: ✅ Mitigated (Credentials removed from current files, but still in Git history)

---

## 📋 Executive Summary

SMTP credentials for the UpGrad email account were accidentally committed and pushed to the public GitHub repository in multiple files. This RCA documents the incident, identifies root causes, and provides remediation steps.

---

## 🚨 What Happened

### Timeline of Events

1. **Initial Exposure** (Commit: `7ff38d1`)
   - File: `test-gmail-smtp.js`
   - Exposed: Email and app password in plaintext
   - Also exposed in: `DEPLOY_NOW.md`, `VERCEL_DEPLOYMENT_FIX.md`

2. **Discovery** (December 12, 2025, 21:40 IST)
   - User identified the security issue
   - Immediate action requested

3. **Mitigation Started** (December 12, 2025, 21:40 IST)
   - Credentials removed from current files
   - Files updated to use environment variables
   - Security fix committed (Commit: `6b62932`)

4. **Additional Cleanup** (December 12, 2025, 21:50 IST)
   - Found credentials in documentation files
   - Removed from all current files
   - RCA initiated

---

## 🔍 Root Cause Analysis

### Primary Root Cause
**Hardcoded credentials in source code for testing purposes**

### Contributing Factors

1. **Lack of .env Usage**
   - Test file used hardcoded credentials instead of environment variables
   - No clear separation between test data and production code

2. **Documentation Included Real Credentials**
   - Deployment guides (`DEPLOY_NOW.md`, `VERCEL_DEPLOYMENT_FIX.md`) contained actual credentials
   - Should have used placeholder values

3. **No Pre-Commit Hooks**
   - No automated scanning for secrets before commits
   - No git hooks to prevent credential commits

4. **Insufficient Security Review**
   - Files not reviewed for sensitive data before committing
   - No security checklist followed

---

## 📊 Impact Assessment

### Exposed Information

| Item | Value | Exposure Level |
|------|-------|----------------|
| Email | `int***@upgrad.com` | 🔴 HIGH |
| App Password | `fvv***ttsp` | 🔴 CRITICAL |
| SMTP Server | `smtp.office365.com` | 🟡 LOW (public info) |
| SMTP Port | `587` | 🟡 LOW (public info) |

### Affected Files (in Git history)

1. ✅ `test-gmail-smtp.js` - Fixed
2. ✅ `DEPLOY_NOW.md` - Fixed
3. ✅ `VERCEL_DEPLOYMENT_FIX.md` - Fixed
4. ✅ `SECURITY_FIX.md` - Fixed

### Potential Risks

- ✅ **Email Account Access**: Anyone with the credentials could send emails
- ✅ **Reputation Damage**: Emails could be sent from the account
- ✅ **Data Breach**: Access to email communications
- ⚠️ **Still in Git History**: Credentials remain in repository history

---

## ✅ Immediate Actions Taken

### 1. Credential Removal
- ✅ Removed from `test-gmail-smtp.js`
- ✅ Removed from `DEPLOY_NOW.md`
- ✅ Removed from `VERCEL_DEPLOYMENT_FIX.md`
- ✅ Redacted in `SECURITY_FIX.md`

### 2. Code Updates
- ✅ Updated `test-gmail-smtp.js` to use environment variables
- ✅ Added `require('dotenv').config()`
- ✅ Updated documentation with placeholder values

### 3. Git Commits
- ✅ Commit `6b62932`: Security fix for test file
- ✅ Commit `[pending]`: Documentation cleanup

---

## 🔐 Required Actions (URGENT)

### ⚠️ MUST DO IMMEDIATELY

1. **Regenerate App Password**
   ```
   1. Go to: https://account.microsoft.com/security
   2. Navigate to "App passwords"
   3. Delete the exposed password
   4. Generate a new app password
   5. Save it securely
   ```

2. **Update Local Environment**
   ```bash
   # Add to .env file (NOT committed to Git)
   TEST_EMAIL=your-email@upgrad.com
   TEST_APP_PASSWORD=your-new-password-here
   ```

3. **Update Vercel Environment Variables**
   - If using the same credentials on Vercel, update them there too

### 🧹 Recommended Actions

4. **Clean Git History** (Optional but recommended)
   ```bash
   # Remove file from entire Git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch test-gmail-smtp.js" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: Destructive)
   git push origin --force --all
   ```

5. **Review Account Activity**
   - Check Microsoft account for suspicious logins
   - Review sent emails for unauthorized activity

---

## 🛡️ Preventive Measures

### Immediate Implementation

1. **✅ Environment Variables**
   - All credentials now use `.env` files
   - `.env` is in `.gitignore`

2. **✅ Documentation Standards**
   - Use placeholder values in docs
   - Never include real credentials

### Recommended Future Improvements

3. **Pre-Commit Hooks**
   ```bash
   # Install git-secrets or similar
   npm install --save-dev @commitlint/cli husky
   
   # Add pre-commit hook to scan for secrets
   ```

4. **Secret Scanning**
   - Enable GitHub secret scanning
   - Use tools like `truffleHog` or `gitleaks`

5. **Security Checklist**
   - Review all files before commit
   - Use `git diff` to check changes
   - Never commit `.env` files

6. **Code Review Process**
   - Require PR reviews before merging
   - Include security review in PR template

---

## 📚 Lessons Learned

### What Went Wrong
1. ❌ Hardcoded credentials in test files
2. ❌ No automated secret detection
3. ❌ Documentation contained real credentials
4. ❌ No security review before commit

### What Went Right
1. ✅ Quick detection and response
2. ✅ `.env` files already in `.gitignore`
3. ✅ Immediate mitigation actions taken
4. ✅ Comprehensive documentation created

---

## 🎯 Action Items

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| 🔴 P0 | Regenerate app password | User | ⏳ Pending |
| 🔴 P0 | Update local `.env` | User | ⏳ Pending |
| 🟡 P1 | Clean Git history | User | ⏳ Optional |
| 🟡 P1 | Review account activity | User | ⏳ Pending |
| 🟢 P2 | Implement pre-commit hooks | Dev | 📋 Planned |
| 🟢 P2 | Enable GitHub secret scanning | Dev | 📋 Planned |

---

## 📞 Support & Resources

### Immediate Help
- **Microsoft Security**: https://account.microsoft.com/security
- **GitHub Support**: https://support.github.com

### Tools for Secret Detection
- **git-secrets**: https://github.com/awslabs/git-secrets
- **gitleaks**: https://github.com/gitleaks/gitleaks
- **truffleHog**: https://github.com/trufflesecurity/truffleHog

---

## 🔄 Follow-Up

- [ ] Verify new credentials work
- [ ] Confirm no unauthorized account access
- [ ] Implement preventive measures
- [ ] Update security documentation
- [ ] Train team on secure coding practices

---

**RCA Completed By**: AI Assistant  
**Reviewed By**: [Pending]  
**Next Review Date**: After password regeneration

---

## 🚨 CRITICAL REMINDER

**The exposed credentials are still in Git history!**

Even though they're removed from current files, they can still be accessed via:
- `git log`
- GitHub commit history
- Git blame

**You MUST regenerate the app password immediately!**
