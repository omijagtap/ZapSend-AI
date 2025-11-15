# Changelog - ZapSend AI Email Dispatcher

## Version 2.1.0 - November 11, 2025

### 🎨 **Visual Updates**
- **Brand Color Update**: Changed primary color from `#EE2C3C` to `#F23E36` across the entire application
- Updated `globals.css` with new HSL color values for consistent theming
- Updated `blueprint.md` documentation with new brand color

---

### 🔗 **Hyperlink Conversion Feature** ✨
Automatically converts plain text URLs to clickable hyperlinks in emails!

#### **What's New:**
- **Auto-detection**: Detects `http://`, `https://`, and `www.` URLs
- **Smart conversion**: Adds `http://` protocol to `www.` URLs automatically
- **Brand styling**: All hyperlinks styled with brand color (#F23E36)
- **Email-safe**: Uses inline styles for maximum email client compatibility

#### **Where It Works:**
- ✅ Email template content (both .txt and .md files)
- ✅ CSV data placeholders
- ✅ Markdown-generated HTML
- ✅ Email preview
- ✅ Sent emails

#### **Technical Details:**
- New utility functions in `src/lib/utils.ts`:
  - `convertLinksToHyperlinks()` - For plain text
  - `convertLinksInHtml()` - For HTML content
- Enhanced `generateEmailBody()` function in EmailDispatcher
- Opens links in new tab with `target="_blank"`
- Includes `rel="noopener noreferrer"` for security

---

### ✉️ **Email Validation System** 🛡️
Advanced email validation to improve deliverability and reduce bounces!

#### **Features:**
- **Format validation**: Checks for proper email structure
- **Typo detection**: Catches common domain typos (e.g., `gmial.com` → `gmail.com`)
- **Character validation**: Prevents invalid characters
- **Domain validation**: Ensures valid domain format with proper TLD
- **Helpful error messages**: Specific feedback for each validation issue

#### **What It Catches:**
- ❌ Missing @ symbol
- ❌ Multiple @ symbols
- ❌ Invalid characters
- ❌ Missing domain
- ❌ Consecutive dots
- ❌ Common typos: `gmial.com`, `yahooo.com`, `hotmial.com`, `outlok.com`

#### **Technical Details:**
- New functions in `src/lib/utils.ts`:
  - `validateEmail()` - Single email validation
  - `validateEmailBatch()` - Batch validation
- Returns detailed error messages for better UX
- Can be integrated into CSV validation flow

---

### 🔄 **Retry Failed Emails** 🎯
One-click retry for failed email sends!

#### **How It Works:**
1. Campaign completes with some failed emails
2. Dashboard shows "Retry Failed" button with count
3. Click button to return to email dispatcher
4. Failed email addresses are pre-loaded
5. Retry sending with same or updated settings

#### **Features:**
- **Smart filtering**: Only shows retry button when failures exist
- **Persistent storage**: Failed emails stored in localStorage
- **Visual feedback**: Button styled with primary color for visibility
- **Seamless flow**: Returns to main page with context preserved

#### **Technical Details:**
- Enhanced `src/app/dashboard/page.tsx`
- New `handleRetryFailed()` function
- Stores failed emails in `localStorage` with key `emailDispatcher:retryEmails`
- Integrates with existing email dispatcher workflow

---

### 📊 **CSV Export for Reports** 📈
Export campaign reports in CSV format for easy analysis!

#### **Features:**
- **One-click export**: Download reports as CSV files
- **Proper formatting**: Handles special characters and quotes
- **Complete data**: Includes email, status, and error details
- **Timestamped**: Filename includes subject and date

#### **CSV Structure:**
```csv
Email,Status,Error/Reason
"user@example.com",Sent,-
"invalid@test",Failed,"SMTP Error: Invalid recipient"
"missing@data.com",Skipped,"Missing fields: Name, Company"
```

#### **Use Cases:**
- Import into Excel/Google Sheets for analysis
- Share with team members
- Archive campaign results
- Create custom reports and visualizations

#### **Technical Details:**
- New `handleDownloadCSV()` function in dashboard
- Proper CSV escaping for special characters
- UTF-8 encoding for international characters
- Separate from existing TXT report download

---

### 🎯 **Drag & Drop File Upload** 🖱️
Modern drag & drop interface for file uploads!

#### **Features:**
- **Visual feedback**: Highlights drop zone when dragging files
- **File type validation**: Only accepts specified file types
- **Smooth animations**: Scale and color transitions
- **Fallback support**: Still works with traditional click-to-browse

#### **Where It Works:**
- ✅ Email template upload (.txt, .md)
- ✅ CSV file upload (.csv)
- 🎨 Visual hover states
- 🎨 Active drag states with primary color

#### **User Experience:**
1. Drag file over upload area
2. Drop zone highlights with primary color
3. File automatically processes
4. Instant feedback on success/error

#### **Technical Details:**
- New component: `src/components/ui/file-dropzone.tsx`
- Integrated into EmailDispatcher
- Uses HTML5 Drag & Drop API
- Reuses existing file processing logic
- Maintains backward compatibility with click upload

---

### 💾 **Auto-save Functionality** 💿
Already implemented via localStorage persistence!

#### **What's Saved:**
- Email subject
- Template content
- CSV data
- Selected mode (personalized/BCC)
- Attachments
- Banner image
- Campaign reports

#### **How It Works:**
- Automatic save on every change
- Persists across browser sessions
- Custom hook: `useStickyState()`
- Namespace: `emailDispatcher:*` and `emailReport:*`

---

## 📝 **Summary of Changes**

### Files Modified:
1. `src/app/globals.css` - Updated brand colors
2. `blueprint.md` - Updated documentation
3. `src/lib/utils.ts` - Added utility functions
4. `src/components/email-sender/EmailDispatcher.tsx` - Enhanced features
5. `src/app/dashboard/page.tsx` - Added retry and CSV export

### Files Created:
1. `src/components/ui/file-dropzone.tsx` - Drag & drop component
2. `FEATURE_SUGGESTIONS.md` - Future feature ideas
3. `CHANGELOG.md` - This file

---

## 🚀 **Performance & Quality**

### Improvements:
- ✅ Better email deliverability with validation
- ✅ Reduced user errors with drag & drop
- ✅ Faster workflow with retry functionality
- ✅ Better data analysis with CSV export
- ✅ Professional appearance with hyperlinks

### Code Quality:
- ✅ TypeScript for type safety
- ✅ Reusable utility functions
- ✅ Proper error handling
- ✅ Accessible UI components
- ✅ Responsive design maintained

---

## 🎯 **Next Steps**

See `FEATURE_SUGGESTIONS.md` for 30+ additional feature ideas, including:
- Email scheduling
- Templates library
- Email analytics dashboard
- A/B testing
- Multi-language support
- API access
- And much more!

---

## 🐛 **Known Issues**

- CSS linter warnings for Tailwind directives (safe to ignore)
- No issues affecting functionality

---

## 📞 **Support**

For questions or issues, refer to:
- `README.md` - Setup instructions
- `blueprint.md` - Design guidelines
- `FEATURE_SUGGESTIONS.md` - Future roadmap

---

**Built with ❤️ for ZapSend AI**
