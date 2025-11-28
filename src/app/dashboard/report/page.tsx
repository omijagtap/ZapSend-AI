"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/email-sender/Header';
import type { SendStatus, ValidationSummary } from '@/components/email-sender/EmailDispatcher';
import { ArrowLeft, CheckCircle2, Download, Users, XCircle, RefreshCw, FileSpreadsheet } from 'lucide-react';

export default function ReportPage() {
    const [status, setStatus] = useState<SendStatus[]>([]);
    const [summary, setSummary] = useState<ValidationSummary | null>(null);
    const [subject, setSubject] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedStatus = window.localStorage.getItem('emailReport:status');
            const storedSummary = window.localStorage.getItem('emailReport:summary');
            const storedSubject = window.localStorage.getItem('emailReport:subject');

            if (storedStatus) setStatus(JSON.parse(storedStatus));
            if (storedSummary) setSummary(JSON.parse(storedSummary));
            if (storedSubject) setSubject(JSON.parse(storedSubject));
        }
    }, []);

    const handleDownloadReport = () => {
        if (!summary) return;

        const dateStr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
        const sentCount = status.filter(s => s.status === 'Sent').length;
        const failedCount = status.filter(s => s.status === 'Failed').length;
        const skippedCount = summary.invalid;

        let reportContent = `--- EMAIL REPORT ---\n`;
        reportContent += `Subject: ${subject}\n`;
        reportContent += `Date: ${dateStr}\n\n`;
        reportContent += `--- SUMMARY ---\n`;
        reportContent += `Total rows in CSV: ${summary.total}\n`;
        reportContent += `Sent: ${sentCount}\n`;
        reportContent += `Failed: ${failedCount}\n`;
        reportContent += `Skipped (invalid): ${skippedCount}\n\n`;
        reportContent += `--- DETAILED LOG ---\n`;

        status.forEach(s => {
            reportContent += `${s.email} --> ${s.status}${s.error ? ` (${s.error})` : ''}\n`;
        });

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Email Report - ${subject} - ${dateStr}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadCSV = () => {
        if (!summary) return;

        const dateStr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

        // CSV Header
        let csvContent = 'Email,Status,Error/Reason\n';

        // CSV Rows
        status.forEach(s => {
            const email = `"${s.email}"`;
            const statusText = s.status;
            const error = s.error ? `"${s.error.replace(/"/g, '""')}"` : '-';
            csvContent += `${email},${statusText},${error}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Email Report - ${subject} - ${dateStr}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRetryFailed = () => {
        const failedEmails = status.filter(s => s.status === 'Failed');
        if (failedEmails.length === 0) return;

        // Store failed emails for retry
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('emailDispatcher:retryEmails', JSON.stringify(failedEmails.map(s => s.email)));
            router.push('/dashboard');
        }
    };

    const sentCount = status.filter(s => s.status === 'Sent').length;
    const failedCount = status.filter(s => s.status === 'Failed').length;
    const skippedCount = summary ? summary.invalid : status.filter(s => s.status === 'Skipped').length;

    if (!summary && typeof window !== 'undefined') {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
                <Header />
                <p className="text-muted-foreground mb-4">Loading report or no data available.</p>
                <Button onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Sender
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-headline text-primary-foreground">Campaign Report</h1>
                            <p className="text-muted-foreground mt-1">Subject: {subject}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleDownloadCSV} variant="outline">
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                            <Button onClick={handleDownloadReport} variant="outline">
                                <Download className="mr-2 h-4 w-4" /> Download TXT
                            </Button>
                            {failedCount > 0 && (
                                <Button onClick={handleRetryFailed} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Retry Failed ({failedCount})
                                </Button>
                            )}
                            <Button onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> New Campaign
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <Card className="glass-effect">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{sentCount}</div>
                                <p className="text-xs text-muted-foreground">Successfully dispatched</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-effect">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emails Failed</CardTitle>
                                <XCircle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{failedCount}</div>
                                <p className="text-xs text-muted-foreground">Encountered sending errors</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-effect">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emails Skipped</CardTitle>
                                <Users className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{skippedCount}</div>
                                <p className="text-xs text-muted-foreground">Invalid or missing data</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="glass-effect">
                        <CardHeader>
                            <CardTitle>Detailed Log</CardTitle>
                            <CardDescription>A record of every email that was processed in this campaign.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[500px] overflow-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Reason / Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {status.length > 0 ? status.map((s, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-mono">{s.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        s.status === 'Sent' ? 'default' :
                                                            s.status === 'Failed' ? 'destructive' :
                                                                'secondary'
                                                    } className={s.status === 'Sent' ? 'bg-green-600/80' : ''}>
                                                        {s.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground font-mono">{s.error || '-'}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">No logs for this campaign.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
