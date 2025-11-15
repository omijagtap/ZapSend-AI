"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/email-sender/Header';
import { Mail, TrendingUp, Users, Calendar, Eye } from 'lucide-react';
import { getServerSession } from '@/app/actions';

interface UserSession {
  email: string;
  appPassword: string;
  loginTime: string;
}

interface UserProfile {
  email: string;
  totalEmailsSent: number;
  totalCampaigns: number;
  lastLoginTime: string;
  firstLoginTime: string;
}

interface EmailRecord {
  id: string;
  email: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  status: 'success' | 'partial' | 'failed';
  senderEmail: string;
}

export default function AnalyticsPage() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmailsSent: 0,
    todayEmailsSent: 0,
    uniqueRecipients: 0,
    successRate: 0,
    isLoggedIn: false,
  });
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      setIsLoading(true);
      
      // Check if user has session cookie from server
      const serverSession = await getServerSession();
      
      if (!serverSession) {
        setIsLoading(false);
        setStats(prev => ({ ...prev, isLoggedIn: false }));
        return;
      }
      
      // Set user session (without password for security)
      setUserSession({
        email: serverSession.email,
        appPassword: '[REDACTED:password]',
        loginTime: serverSession.loginTime
      });
      setStats(prev => ({ ...prev, isLoggedIn: true }));

      // Load or create user profile
      if (typeof window !== 'undefined') {
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        if (!userProfiles[serverSession.email]) {
          userProfiles[serverSession.email] = {
            email: serverSession.email,
            totalEmailsSent: 0,
            totalCampaigns: 0,
            firstLoginTime: new Date().toISOString(),
            lastLoginTime: new Date().toISOString(),
          };
        } else {
          userProfiles[serverSession.email].lastLoginTime = new Date().toISOString();
        }
        
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
        setUserProfile(userProfiles[serverSession.email]);

        // Load email history
        const emailHistory = localStorage.getItem('emailHistory:records') || '[]';
        try {
          const records: EmailRecord[] = JSON.parse(emailHistory);
          console.log('All email records:', records);
          console.log('Current user email:', serverSession.email);
          
          // Filter to show only user's own emails (case-insensitive)
          const userRecords = records.filter(r => 
            r.senderEmail && serverSession.email && 
            r.senderEmail.toLowerCase() === serverSession.email.toLowerCase()
          );
          console.log('Filtered user records:', userRecords);
          
          setEmailRecords(userRecords);
          calculateStats(userRecords);

          // Update user profile with email stats
          const userEmailCount = userRecords.length;
          const userEmailsSent = userRecords.reduce((sum, r) => sum + r.recipientCount, 0);

          userProfiles[serverSession.email].totalCampaigns = userEmailCount;
          userProfiles[serverSession.email].totalEmailsSent = userEmailsSent;
          localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
          setUserProfile(userProfiles[serverSession.email]);
        } catch (e) {
          console.error('Error loading email history:', e);
          setEmailRecords([]);
        }
      }
      
      setIsLoading(false);
    };

    checkSessionAndLoad();
  }, []);

  const calculateStats = (records: EmailRecord[]) => {
    const today = new Date().toDateString();
    const todayRecords = records.filter(r => new Date(r.sentAt).toDateString() === today);

    const totalSent = records.reduce((sum, r) => sum + r.recipientCount, 0);
    const todaySent = todayRecords.reduce((sum, r) => sum + r.recipientCount, 0);
    const totalSuccess = records.reduce((sum, r) => sum + r.successCount, 0);
    const successRate = totalSent > 0 ? Math.round((totalSuccess / totalSent) * 100) : 0;

    setStats(prev => ({
      ...prev,
      totalEmailsSent: totalSent,
      todayEmailsSent: todaySent,
      uniqueRecipients: records.length,
      successRate,
    }));
  };

  const handleLogout = async () => {
    // Call server action to clear session cookie
    const { logout } = await import('@/app/actions');
    await logout();
    
    if (typeof window !== 'undefined') {
      setStats(prev => ({ ...prev, isLoggedIn: false }));
      setUserSession(null);
      setEmailRecords([]);
      router.push('/login');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysBefore = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toDateString();
  };

  const getTodaysEmails = () => {
    const today = new Date().toDateString();
    return emailRecords.filter(r => new Date(r.sentAt).toDateString() === today);
  };

  const getLast7DaysEmails = () => {
    const sevenDaysAgo = getDaysBefore(7);
    return emailRecords.filter(r => new Date(r.sentAt) > new Date(sevenDaysAgo));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats.isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-headline mb-4">Analytics Dashboard</h1>
            <p className="text-muted-foreground mb-6">Please login to view your email analytics and campaign history.</p>
            <Button onClick={() => router.push('/login')} size="lg">
              Login to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline text-primary-foreground">Email Analytics</h1>
              <p className="text-muted-foreground mt-1">
                {userSession?.email ? `Logged in as: ${userSession.email}` : 'Dashboard Overview'}
              </p>
            </div>
            {userSession && (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmailsSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Emails</CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayEmailsSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Sent today</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Successful deliveries</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueRecipients}</div>
                <p className="text-xs text-muted-foreground">Total campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Campaigns */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Today's Campaigns
                </CardTitle>
                <CardDescription>Email campaigns sent today</CardDescription>
              </CardHeader>
              <CardContent>
                {getTodaysEmails().length > 0 ? (
                  <div className="space-y-3">
                    {getTodaysEmails().map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate">{record.subject}</p>
                          <p className="text-xs text-muted-foreground">{record.recipientCount} recipients</p>
                        </div>
                        <Badge variant={record.status === 'success' ? 'default' : record.status === 'partial' ? 'secondary' : 'destructive'}>
                          {record.successCount}/{record.recipientCount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No campaigns sent today</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Last 7 Days
                </CardTitle>
                <CardDescription>Recent email activity</CardDescription>
              </CardHeader>
              <CardContent>
                {getLast7DaysEmails().length > 0 ? (
                  <div className="space-y-3">
                    {getLast7DaysEmails().slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate">{record.subject}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(record.sentAt)}</p>
                        </div>
                        <Badge variant="outline">
                          {record.successCount} ✓
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No campaigns in the last 7 days</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Campaign History */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Campaign History
              </CardTitle>
              <CardDescription>All email campaigns and their delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Successful</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailRecords.length > 0 ? (
                      emailRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium truncate max-w-[200px]">{record.subject}</TableCell>
                          <TableCell className="text-sm">{formatDate(record.sentAt)}</TableCell>
                          <TableCell>{record.recipientCount}</TableCell>
                          <TableCell className="text-green-600 font-medium">{record.successCount}</TableCell>
                          <TableCell className="text-red-600 font-medium">{record.failureCount}</TableCell>
                          <TableCell>
                            <Badge variant={record.status === 'success' ? 'default' : record.status === 'partial' ? 'secondary' : 'destructive'}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No campaigns sent yet. Start by sending your first email campaign!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Button onClick={() => router.push('/')} variant="default">
              Return to Home
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              View Last Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
