"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Zap, Users, Calendar } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-[#F23E36]" />
                        <span className="text-base font-bold">
                            <span className="text-[#F23E36]">ZapSend</span>
                            <span className="text-white"> AI</span>
                        </span>
                    </div>
                    <Button
                        asChild
                        className="h-8 px-4 text-xs bg-[#F23E36] hover:bg-[#D63529] text-white border-0"
                    >
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Send Bulk Emails
                        <br />
                        <span className="text-[#F23E36]">In Seconds</span>
                    </h1>
                    <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
                        Professional email marketing platform. Upload your template, add recipients, and send personalized emails at scale.
                    </p>
                    <Button
                        asChild
                        className="h-10 px-6 text-sm bg-[#F23E36] hover:bg-[#D63529] text-white border-0"
                    >
                        <Link href="/login">
                            Get Started Free
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-500 mt-3">No credit card • Free forever • 2 min setup</p>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6 border-t border-white/10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Everything You Need</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#F23E36]/50 transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-[#F23E36]/20 flex items-center justify-center mb-4 group-hover:bg-[#F23E36]/30 transition-colors">
                                <Users className="h-5 w-5 text-[#F23E36]" />
                            </div>
                            <h3 className="text-sm font-semibold mb-2">Bulk & Personalized</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Send to hundreds with one click or personalize each email with dynamic placeholders
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#F23E36]/50 transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-[#F23E36]/20 flex items-center justify-center mb-4 group-hover:bg-[#F23E36]/30 transition-colors">
                                <Zap className="h-5 w-5 text-[#F23E36]" />
                            </div>
                            <h3 className="text-sm font-semibold mb-2">AI-Powered</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Smart subject line optimization to dramatically improve your email open rates
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#F23E36]/50 transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-[#F23E36]/20 flex items-center justify-center mb-4 group-hover:bg-[#F23E36]/30 transition-colors">
                                <Calendar className="h-5 w-5 text-[#F23E36]" />
                            </div>
                            <h3 className="text-sm font-semibold mb-2">Schedule Sending</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Pick date and time for your campaigns. Set timezone and auto-send
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-6 border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F23E36] flex items-center justify-center text-xs font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Connect Your Email</h3>
                                <p className="text-xs text-gray-400">Sign in with Gmail or Outlook using app password</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F23E36] flex items-center justify-center text-xs font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Create Your Email</h3>
                                <p className="text-xs text-gray-400">Write directly or upload template (.txt, .md, .html)</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F23E36] flex items-center justify-center text-xs font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Upload Recipients</h3>
                                <p className="text-xs text-gray-400">Add CSV file with email addresses and custom fields</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F23E36] flex items-center justify-center text-xs font-bold">
                                4
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Send or Schedule</h3>
                                <p className="text-xs text-gray-400">Send immediately or schedule for later</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Use Guide - Article Style */}
            <section className="py-20 px-6 border-t border-white/10 bg-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold mb-2">Complete Guide</h2>
                        <p className="text-xs text-gray-400">Everything you need to know to send your first campaign</p>
                    </div>

                    <div className="space-y-12">
                        {/* Guide Section 1 */}
                        <div className="border-l-2 border-[#F23E36] pl-6">
                            <h3 className="text-lg font-bold mb-3">1. Setting Up Your Account</h3>

                            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                                <p>
                                    <strong className="text-white">Gmail Users:</strong> Go to your Google Account → Security → 2-Step Verification → App Passwords.
                                    Generate a new app password for "Mail" and copy it. Use this password (not your regular password) when logging into ZapSend AI.
                                </p>

                                <p>
                                    <strong className="text-white">Outlook Users:</strong> Visit account.microsoft.com → Security → Advanced security options → App passwords.
                                    Create a new app password and use it for authentication.
                                </p>

                                <div className="p-4 bg-black/50 rounded border border-white/10 mt-3">
                                    <p className="text-[#F23E36] font-semibold mb-2">⚠️ Important Security Note:</p>
                                    <p className="text-xs">Never share your app password. ZapSend AI stores it securely in encrypted cookies and never saves it to any database.</p>
                                </div>
                            </div>
                        </div>

                        {/* Guide Section 2 */}
                        <div className="border-l-2 border-[#F23E36] pl-6">
                            <h3 className="text-lg font-bold mb-3">2. Creating Your Email Template</h3>

                            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                                <p>
                                    <strong className="text-white">Choose Your Format:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2">
                                    <li><strong>Plain Text:</strong> Simple, clean emails. Best for personal outreach.</li>
                                    <li><strong>Markdown:</strong> Add formatting like **bold**, *italic*, and links. Converts to HTML automatically.</li>
                                    <li><strong>HTML:</strong> Full control over design. Upload beautiful templates with inline CSS.</li>
                                </ul>

                                <p className="mt-4">
                                    <strong className="text-white">Using Placeholders:</strong> Personalize emails with dynamic content.
                                </p>

                                <div className="p-4 bg-black/50 rounded border border-white/10 mt-3 font-mono">
                                    <p className="text-gray-400 mb-2">Example:</p>
                                    <code className="text-[#F23E36] text-xs">
                                        Hi {'{{FirstName}}'}, <br />
                                        <br />
                                        I noticed you work at {'{{Company}}'}. <br />
                                        Would love to connect!
                                    </code>
                                </div>

                                <p className="text-gray-400 text-xs mt-3">
                                    ✓ Placeholders must match your CSV column names exactly<br />
                                    ✓ Use double curly braces: {'{{ColumnName}}'}<br />
                                    ✓ Case-sensitive
                                </p>
                            </div>
                        </div>

                        {/* Guide Section 3 */}
                        <div className="border-l-2 border-[#F23E36] pl-6">
                            <h3 className="text-lg font-bold mb-3">3. Preparing Your Recipient List</h3>

                            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                                <p>
                                    <strong className="text-white">CSV File Requirements:</strong>
                                </p>

                                <div className="p-4 bg-black/50 rounded border border-white/10 mt-3">
                                    <p className="text-gray-400 mb-2">Required Format:</p>
                                    <pre className="text-[#F23E36] text-xs overflow-x-auto">
                                        {`Email,FirstName,Company
john@example.com,John,Acme Corp
jane@example.com,Jane,Tech Inc
mike@example.com,Mike,StartupXYZ`}
                                    </pre>
                                </div>

                                <p className="mt-4">
                                    <strong className="text-white">Best Practices:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2">
                                    <li>First row must be column headers</li>
                                    <li>"Email" column is required (case-sensitive)</li>
                                    <li>Add any custom columns for personalization</li>
                                    <li>Remove duplicates before uploading</li>
                                    <li>Validate email addresses</li>
                                </ul>
                            </div>
                        </div>

                        {/* Guide Section 4 */}
                        <div className="border-l-2 border-[#F23E36] pl-6">
                            <h3 className="text-lg font-bold mb-3">4. Choosing Send Mode</h3>

                            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/50 rounded border border-white/10">
                                        <p className="text-white font-semibold mb-2">📧 Bulk BCC Mode</p>
                                        <p className="text-xs text-gray-400 mb-3">Send same email to everyone</p>
                                        <p className="text-xs"><strong>Use when:</strong></p>
                                        <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                                            <li>Sending newsletters</li>
                                            <li>General announcements</li>
                                            <li>No personalization needed</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-[#F23E36]/10 rounded border border-[#F23E36]/30">
                                        <p className="text-white font-semibold mb-2">✨ Personalized Mode</p>
                                        <p className="text-xs text-gray-400 mb-3">Custom email per recipient</p>
                                        <p className="text-xs"><strong>Use when:</strong></p>
                                        <ul className="list-disc list-inside text-xs text-gray-400 mt-2 space-y-1">
                                            <li>Cold outreach</li>
                                            <li>Sales emails</li>
                                            <li>Personal touch needed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guide Section 5 */}
                        <div className="border-l-2 border-[#F23E36] pl-6">
                            <h3 className="text-lg font-bold mb-3">5. Advanced Features</h3>

                            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                                <p>
                                    <strong className="text-white">AI Subject Line Optimizer:</strong> Get smart suggestions to improve open rates.
                                    Our AI analyzes your subject line and provides alternatives optimized for engagement.
                                </p>

                                <p>
                                    <strong className="text-white">Schedule Sending:</strong> Pick a specific date and time for your campaign.
                                    Select your timezone and the system will automatically send at the scheduled time.
                                </p>

                                <p>
                                    <strong className="text-white">Campaign Management:</strong> Save your templates and recipient lists for future use.
                                    Duplicate successful campaigns and track performance.
                                </p>
                            </div>
                        </div>

                        {/* Tips Section */}
                        <div className="p-6 bg-[#F23E36]/10 rounded-lg border border-[#F23E36]/30">
                            <h3 className="text-sm font-bold mb-4 text-white">💡 Pro Tips for Better Results</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-300">
                                <div>
                                    <p className="font-semibold text-white mb-2">Email Deliverability:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Keep subject lines under 50 characters</li>
                                        <li>Avoid spam trigger words (FREE, URGENT, etc.)</li>
                                        <li>Include unsubscribe option</li>
                                        <li>Send test email first</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-2">Personalization:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Use recipient's name in subject line</li>
                                        <li>Reference their company or role</li>
                                        <li>Keep it natural and conversational</li>
                                        <li>Test placeholders before sending</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 border-t border-white/10">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-sm text-gray-400 mb-8">
                        Join thousands sending beautiful emails with ZapSend AI
                    </p>
                    <Button
                        asChild
                        className="h-10 px-6 text-sm bg-[#F23E36] hover:bg-[#D63529] text-white border-0"
                    >
                        <Link href="/login">
                            Start Free Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs text-gray-500">© 2025 ZapSend AI. Built for email marketers.</p>
                </div>
            </footer>
        </div>
    );
}
