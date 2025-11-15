import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts plain text URLs to clickable HTML hyperlinks
 * Supports http://, https://, and www. URLs
 * @param text - The text containing URLs to convert
 * @returns HTML string with URLs converted to hyperlinks
 */
export function convertLinksToHyperlinks(text: string): string {
  if (!text) return text;
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
  
  return text.replace(urlRegex, (url) => {
    // Add protocol if missing (for www. URLs)
    const href = url.startsWith('www.') ? `http://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #F23E36; text-decoration: underline;">${url}</a>`;
  });
}

/**
 * Converts plain text URLs to clickable HTML hyperlinks for email HTML
 * Uses inline styles for better email client compatibility
 * @param html - The HTML content containing URLs to convert
 * @returns HTML string with URLs converted to styled hyperlinks
 */
export function convertLinksInHtml(html: string): string {
  if (!html) return html;
  
  // Regular expression to match URLs that are NOT already in anchor tags
  const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<"']+|(?<!\/\/)www\.[^\s<"']+)(?![^<]*<\/a>)/gi;
  
  return html.replace(urlRegex, (url) => {
    // Add protocol if missing (for www. URLs)
    const href = url.startsWith('www.') ? `http://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #F23E36; text-decoration: underline;">${url}</a>`;
  });
}

/**
 * Validates email address format and checks for common issues
 * @param email - Email address to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  // Check if empty after trim
  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' };
  }

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check for common typos in domains
  const commonDomainTypos = [
    { wrong: '@gmial.com', correct: '@gmail.com' },
    { wrong: '@gmai.com', correct: '@gmail.com' },
    { wrong: '@yahooo.com', correct: '@yahoo.com' },
    { wrong: '@hotmial.com', correct: '@hotmail.com' },
    { wrong: '@outlok.com', correct: '@outlook.com' },
  ];

  for (const typo of commonDomainTypos) {
    if (trimmedEmail.toLowerCase().includes(typo.wrong)) {
      return { valid: false, error: `Did you mean ${typo.correct}?` };
    }
  }

  // Check for invalid characters
  if (/[<>()[\]\\,;:\s@"]+/.test(trimmedEmail.split('@')[0])) {
    return { valid: false, error: 'Email contains invalid characters' };
  }

  // Check for multiple @ symbols
  if ((trimmedEmail.match(/@/g) || []).length !== 1) {
    return { valid: false, error: 'Email must contain exactly one @ symbol' };
  }

  // Check domain has at least one dot
  const domain = trimmedEmail.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return { valid: false, error: 'Email cannot contain consecutive dots' };
  }

  return { valid: true };
}

/**
 * Validates a batch of email addresses
 * @param emails - Array of email addresses to validate
 * @returns Object with valid and invalid emails
 */
export function validateEmailBatch(emails: string[]): {
  valid: string[];
  invalid: Array<{ email: string; error: string }>;
} {
  const valid: string[] = [];
  const invalid: Array<{ email: string; error: string }> = [];

  emails.forEach((email) => {
    const result = validateEmail(email);
    if (result.valid) {
      valid.push(email.trim());
    } else {
      invalid.push({ email, error: result.error || 'Invalid email' });
    }
  });

  return { valid, invalid };
}
