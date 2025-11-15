
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/email-sender/Header';
import { Loader2, LogIn, Shield, HelpCircle, ExternalLink, Mail, Zap, BarChart3, CheckCircle2, Sparkles, Users, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyCredentialsAndLogin, getUserSession } from '@/app/actions';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PixelBlast from '@/components/PixelBlast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const session = await getUserSession();
        if (session?.email) {
          // User is already logged in, redirect to home
          router.replace('/');
        }
      } catch (error) {
        // Error checking session, stay on login page
        console.log('No existing session found');
      }
    };
    checkExistingLogin();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter both your Outlook Email and App Password.',
      });
      return;
    }
    
    setIsLoading(true);
    setLoadingStage('Verifying... Sending Test Email...');
    
    const result = await verifyCredentialsAndLogin(email, password);

    if (result.success) {
      toast({
        title: 'Login Successful',
        description: 'Your credentials have been verified. Redirecting...',
      });
      setLoadingStage('Redirecting...');
      // Use window.location.href to force a full page reload and bypass router cache.
      // This is the most reliable way to handle the post-login redirect.
      window.location.href = '/';
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error || 'Could not verify your credentials. Please check them and try again.',
      });
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <PixelBlast 
        variant="circle"
        pixelSize={4}
        color="#8B5CF6"
        opacity={0.4}
        speed={0.5}
        enableRipples
        liquid
        transparent
        patternDensity={1.3}
        liquidStrength={0.1}
      />
      <div className="relative z-10">
        <Header />
        <main className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center w-full">
          
          {/* Login Form - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="glass-effect">
                <CardHeader className="text-center pb-3">
                    <CardTitle className="text-xl font-headline">Welcome User</CardTitle>
                    <CardDescription className="text-xs">Enter your email credentials to get started</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs">Outlook Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@outlook.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs">App Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="App password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button onClick={handleLogin} disabled={isLoading} className="w-full h-10">
                            <AnimatePresence mode="wait" initial={false}>
                                {isLoading ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-center"
                                    >
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {loadingStage}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="login"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-center"
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login & Verify
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            </Button>
                            </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-3">
                            <div className="w-full space-y-2">
                                <div className="flex items-center justify-center text-[10px] text-muted-foreground gap-1.5">
                                    <Shield className="h-3 w-3" />
                                    <span>Credentials not stored - only used for verification</span>
                                </div>
                                
                                {/* Help Dialog Trigger */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="link" size="sm" className="text-xs text-primary h-auto p-0">
                                      <HelpCircle className="h-3.5 w-3.5 mr-1" />
                                      How to get App Password?
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <HelpCircle className="h-5 w-5 text-primary" />
                                        How to Get Your App Password
                                      </DialogTitle>
                                      <DialogDescription>
                                        Follow these steps to generate an App Password for your email provider
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                        <Tabs defaultValue="outlook" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-9">
                                <TabsTrigger value="outlook" className="text-xs">Outlook / Office 365</TabsTrigger>
                                <TabsTrigger value="gmail" className="text-xs">Gmail</TabsTrigger>
                            </TabsList>
                            
                            {/* Outlook Tab */}
                            <TabsContent value="outlook" className="space-y-2.5 mt-3">
                                <div className="bg-muted/30 p-3 rounded-lg border">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                                        <Shield className="h-3.5 w-3.5 text-primary" />
                                        @outlook.com, @hotmail.com, Office 365
                                    </h4>
                                    <ol className="space-y-1.5 text-xs list-decimal list-inside ml-1">
                                        <li>Visit <a href="https://account.microsoft.com/security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 font-medium">Microsoft Security <ExternalLink className="h-2.5 w-2.5" /></a></li>
                                        <li>Click <strong>"Advanced security options"</strong></li>
                                        <li>Under "App passwords" → <strong>"Create new"</strong></li>
                                        <li>Copy password (xxxx-xxxx-xxxx-xxxx)</li>
                                        <li>Paste in "App Password" field</li>
                                    </ol>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400">
                                        <strong>⚠️ Requirement:</strong> 2-Step Verification must be enabled
                                    </p>
                                </div>
                            </TabsContent>

                            {/* Gmail Tab */}
                            <TabsContent value="gmail" className="space-y-2.5 mt-3">
                                <div className="bg-muted/30 p-3 rounded-lg border">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                                        <Shield className="h-3.5 w-3.5 text-primary" />
                                        @gmail.com or Google Workspace
                                    </h4>
                                    <ol className="space-y-1.5 text-xs list-decimal list-inside ml-1">
                                        <li>Visit <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 font-medium">Google Security <ExternalLink className="h-2.5 w-2.5" /></a></li>
                                        <li>Enable <strong>"2-Step Verification"</strong></li>
                                        <li>Search <strong>"App passwords"</strong></li>
                                        <li>App: <strong>Mail</strong> | Device: <strong>Other</strong></li>
                                        <li>Name: "ZapSend AI" → Generate</li>
                                        <li>Copy 16-character password</li>
                                        <li>Paste in "App Password" field</li>
                                    </ol>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
                                        <p className="text-[10px] text-amber-700 dark:text-amber-400">
                                            <strong>⚠️</strong> Different from Gmail password
                                        </p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-2">
                                        <p className="text-[10px] text-blue-700 dark:text-blue-400">
                                            <strong>📧</strong> smtp.gmail.com:587
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mt-3">
                            <p className="text-xs">
                                <strong className="text-primary">💡 Why App Password?</strong>
                                <br />
                                <span className="text-muted-foreground text-xs">
                                    More secure than regular passwords. Allows email sending without exposing your main account.
                                </span>
                            </p>
                        </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                            </div>
                            </CardFooter>
                            </Card>
                            </motion.div>

                            {/* Features Section - Right Side */}
                            <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                            className="hidden lg:block"
                            >
                            <div className="space-y-4">
                            <div>
                            <h1 className="text-3xl font-bold font-headline text-primary mb-2">
                            Smart Email Campaigns,
                            <br />
                            <span className="text-foreground">Made Simple.</span>
                            </h1>
                            <p className="text-muted-foreground text-sm">
                            Send personalized bulk emails with AI-powered optimization and real-time analytics.
                            </p>
                            </div>

                            <div className="space-y-3">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                            <h3 className="font-semibold text-xs mb-0.5">AI-Powered Subject Lines</h3>
                            <p className="text-[10px] text-muted-foreground">Boost open rates with smart optimization</p>
                            </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                            <h3 className="font-semibold text-xs mb-0.5">Personalized Campaigns</h3>
                            <p className="text-[10px] text-muted-foreground">Dynamic content for each recipient</p>
                            </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                            <h3 className="font-semibold text-xs mb-0.5">Real-Time Analytics</h3>
                            <p className="text-[10px] text-muted-foreground">Track performance and success rates</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            </motion.div>

                            </div>
                            </main>
                        </div>
                        </div>
                        );
                        }
