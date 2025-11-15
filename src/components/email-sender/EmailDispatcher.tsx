

"use client";

import React, { useState, useRef, useMemo, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Mail, Users, Paperclip, AlertTriangle, CheckCircle2, XCircle, Info, Trash2, Redo, Image as ImageIcon, Send, ShieldCheck, Rocket, Loader2, User } from 'lucide-react';
import { SubjectOptimizer } from './SubjectOptimizer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { marked } from 'marked';
import { AnimatePresence, motion } from 'framer-motion';
import { sendEmail, getUserSession } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { convertLinksInHtml } from '@/lib/utils';
import { FileDropzone } from '@/components/ui/file-dropzone';

type Mode = 'personalized' | 'bcc';
type CSVRow = { [key: string]: string };
export type SendStatus = { email: string; status: 'Sent' | 'Failed' | 'Skipped'; error?: string };
export type ValidationSummary = {
    total: number;
    valid: number;
    invalid: number;
    missingColumns: string[];
    extraColumns: string[];
};

const useStickyState = (defaultValue: any, key: string) => {
    const [value, setValue] = useState(() => {
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      try {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null && stickyValue !== 'undefined'
          ? JSON.parse(stickyValue)
          : defaultValue;
      } catch {
        return defaultValue;
      }
    });
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    }, [key, value]);
  
    return [value, setValue];
};


const parseCSV = (text: string): { headers: string[], rows: CSVRow[] } => {
    const lines = text.trim().split(/\r?\n/);
    
    const parseLine = (line: string): string[] => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i+1] === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    };

    const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
    
    const rows = lines.slice(1).map(line => {
        if (!line.trim()) return null;
        const values = parseLine(line);
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
            return obj;
        }, {} as CSVRow);
    }).filter(row => row !== null) as CSVRow[];

    return { headers, rows };
};

const StepCard = ({ title, description, children, step, currentStep }: { title: string; description: string; children: React.ReactNode; step: number; currentStep: number }) => (
    <Card className={`transition-opacity duration-500 glass-effect ${currentStep >= step ? 'opacity-100' : 'opacity-40'}`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {currentStep > step ? <CheckCircle2 size={24} /> : step}
          </div>
          <div>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {currentStep >= step && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ opacity: { duration: 0.2 }, height: { duration: 0.3, ease: 'easeInOut' } }}
            className="overflow-hidden"
          >
            <CardContent>{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );

const initialCsvData: CSVRow[] = [];
const initialCsvHeaders: string[] = [];
const initialAttachments: File[] = [];

export function EmailDispatcher() {
  const [step, setStep] = useStickyState(1, 'emailDispatcher:step');
  const [mode, setMode] = useStickyState<Mode | null>(null, 'emailDispatcher:mode');
  const [subject, setSubject] = useStickyState('', 'emailDispatcher:subject');
  const [rawTemplate, setRawTemplate] = useStickyState('', 'emailDispatcher:rawTemplate');
  const [templateFileName, setTemplateFileName] = useStickyState('', 'emailDispatcher:templateFileName');
  const [csvData, setCsvData] = useStickyState<CSVRow[]>(initialCsvData, 'emailDispatcher:csvData');
  const [csvHeaders, setCsvHeaders] = useStickyState<string[]>(initialCsvHeaders, 'emailDispatcher:csvHeaders');
  const [csvFileName, setCsvFileName] = useStickyState('', 'emailDispatcher:csvFileName');
  const [attachments, setAttachments] = useState<File[]>(initialAttachments);
  const [bannerImage, setBannerImage] = useStickyState<string | null>(null, 'emailDispatcher:bannerImage');
  const [bannerImageName, setBannerImageName] = useStickyState('', 'emailDispatcher:bannerImageName');
  
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentlySendingTo, setCurrentlySendingTo] = useState('');
  const [currentReviewTab, setCurrentReviewTab] = useState('editor');
  
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [testEmailApproved, setTestEmailApproved] = useState(false);
  const [showBannerEditor, setShowBannerEditor] = useState(false);
  const [showTestReminder, setShowTestReminder] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  const templatePlaceholders = useMemo(() => {
    const currentTemplate = editorRef.current ? editorRef.current.value : rawTemplate;
    if (!currentTemplate) return [];
    const matches = currentTemplate.match(/<([^<>]+)>/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(p => p.substring(1, p.length - 1))));
  }, [rawTemplate, editorRef.current?.value]);

  const processFile = (file: File, type: 'template' | 'csv' | 'attachment' | 'banner') => {
    const reader = new FileReader();
  
    reader.onload = (event) => {
        const content = event.target?.result as string;
  
        if (type === 'template') {
            if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
                toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a .txt or .md template file.' });
                return;
            }
            setRawTemplate(content);
            setTemplateFileName(file.name);
            if (step === 2 && subject) setStep(3);
        } else if (type === 'csv') {
            if (!file.name.endsWith('.csv')) {
                toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a .csv data file.' });
                return;
            }
            try {
                const { headers, rows } = parseCSV(content);
                if (!headers.includes('Email')) {
                    throw new Error("CSV must contain 'Email' column.");
                }
                
                setCsvData(rows);
                setCsvHeaders(headers);
                setCsvFileName(file.name);
                if (step === 3) setStep(4);
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'CSV Parsing Error', description: error.message || 'Could not parse CSV file.' });
            }
        } else if (type === 'attachment') {
            setAttachments((prev) => [...prev, file]);
        } else if (type === 'banner') {
            if (!file.type.startsWith('image/')) {
                toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload an image file.' });
                return;
            }
            setBannerImage(content); // This is a data URI
            setBannerImageName(file.name);
        }
    };
    
    if (type === 'banner') {
        reader.readAsDataURL(file);
    } else {
        reader.readAsText(file);
    }
    
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'template' | 'csv' | 'attachment' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file, type);
    e.target.value = ''; // Reset file input
  };
  
  const { validRows, invalidRows, validationSummary } = useMemo(() => {
    if (csvData.length === 0) return { validRows: [], invalidRows: [], validationSummary: null };
    
    const missingColumns = mode === 'personalized' ? templatePlaceholders.filter(ph => !csvHeaders.includes(ph)) : [];
    
    const validated = csvData.map(row => {
      const missingFields: string[] = [];
      if (!row['Email'] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['Email'])) {
        missingFields.push('Email (Invalid)');
      }
      if (mode === 'personalized') {
          templatePlaceholders.forEach(ph => {
              if (row[ph] === undefined || row[ph] === '') missingFields.push(ph);
          });
      }
      return { ...row, missingFields };
    });

    const valid = validated.filter(row => row.missingFields.length === 0);
    const invalid = validated.filter(row => row.missingFields.length > 0);

    const summary: ValidationSummary = {
        total: csvData.length,
        valid: valid.length,
        invalid: invalid.length,
        missingColumns: [...new Set(missingColumns)],
        extraColumns: csvHeaders.filter(h => h !== 'Email' && !templatePlaceholders.includes(h))
    };

    return {
      validRows: valid,
      invalidRows: invalid,
      validationSummary: summary
    };
  }, [csvData, rawTemplate, mode, csvHeaders, templatePlaceholders]);

  const generateEmailBody = (templateContent: string, row?: CSVRow): string => {
    let bodyWithPlaceholders = templateContent;

    if (mode === 'personalized' && row) {
      bodyWithPlaceholders = bodyWithPlaceholders.replace(/<([^<>]+)>/g, (_, placeholder) => {
        const value = String(row[placeholder] || `&lt;${placeholder}&gt;`);
        
        // Convert URLs in CSV data to hyperlinks
        if (value.match(/^https?:\/\//i) || value.match(/^www\./i)) {
          const href = value.startsWith('www.') ? `http://${value}` : value;
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #F23E36; text-decoration: underline;">${value}</a>`;
        }
        
        return value;
      });
    }

    const bannerHtml = bannerImage
      ? `<img src="cid:banner-image" alt="Banner" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto 16px auto;"/>`
      : '';
    
    // Process markdown if the template is a .md file
    let processedBody = bodyWithPlaceholders;
    if (templateFileName && templateFileName.endsWith('.md')) {
      processedBody = marked(bodyWithPlaceholders);
      // Convert URLs in markdown-generated HTML to hyperlinks with brand color
      processedBody = convertLinksInHtml(processedBody);
    } else {
      // For non-markdown files, convert URLs to hyperlinks and line breaks to <br>
      processedBody = bodyWithPlaceholders.replace(/(?<!["'=])(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi, (url) => {
        const href = url.startsWith('www.') ? `http://${url}` : url;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #F23E36; text-decoration: underline;">${url}</a>`;
      });
      processedBody = processedBody.replace(/\n/g, '<br />');
    }
  
    return `<div style="font-family: Inter, sans-serif; color: hsl(var(--foreground)); line-height: 1.6;">${bannerHtml}${processedBody}</div>`;
  };


  const previewBody = useMemo(() => {
    const currentTemplate = editorRef.current ? editorRef.current.value : rawTemplate;
    const firstRow = validRows[0] || csvData[0] || { Email: 'example@email.com' };
    return generateEmailBody(currentTemplate, firstRow);
  }, [rawTemplate, validRows, csvData, mode, bannerImage, editorRef.current?.value]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
  };

  const handleSend = async () => {
    if (isSending) return;
    
    const currentTemplate = editorRef.current?.value || rawTemplate;
    setRawTemplate(currentTemplate);

    setIsSending(true);
    setProgress(0);
    let finalSendStatus: SendStatus[] = [];
    setCurrentlySendingTo('');

    const attachmentData = await Promise.all(
      attachments.map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
          contentType: file.type,
      }))
    );
    
    if (bannerImage) {
        attachmentData.push({
            filename: bannerImageName,
            content: bannerImage.split(',')[1],
            contentType: bannerImage.match(/data:(.*);/)?.[1] || 'image/png',
            cid: 'banner-image',
        });
    }

    if (mode === 'bcc') {
        setCurrentlySendingTo(`all ${validRows.length} recipients (BCC)`);
        const recipients = validRows.map(row => row.Email);
        const html = generateEmailBody(rawTemplate); // Use raw template, no personalization
        const result = await sendEmail({ to: recipients, subject, html, attachments: attachmentData });
        
        const bccStatus = recipients.map(email => ({
            email,
            status: result.success ? 'Sent' : ('Failed' as 'Sent' | 'Failed'),
            error: result.error,
        }));
        setSendStatus(bccStatus);
        finalSendStatus = [...bccStatus];
        setProgress(100);

    } else if (mode === 'personalized') {
        let temporarySendStatus: SendStatus[] = [];
        for (let i = 0; i < validRows.length; i++) {
            const row = validRows[i];
            setCurrentlySendingTo(row.Email);
            const html = generateEmailBody(currentTemplate, row);
            const result = await sendEmail({ to: row.Email, subject, html, attachments: attachmentData });
            
            const currentStatus: SendStatus = { email: row.Email, status: result.success ? 'Sent' : 'Failed', error: result.error };
            temporarySendStatus.push(currentStatus);
            setSendStatus([...temporarySendStatus]);
            setProgress(((i + 1) / validRows.length) * 100);
        }
        finalSendStatus = [...temporarySendStatus];
    }
    
    invalidRows.forEach(row => {
        finalSendStatus.push({ email: row.Email || 'Invalid Email Entry', status: 'Skipped', error: `Missing fields: ${row.missingFields.join(', ')}` });
    });

    if (typeof window !== 'undefined' && validationSummary) {
        window.localStorage.setItem('emailReport:status', JSON.stringify(finalSendStatus));
        window.localStorage.setItem('emailReport:summary', JSON.stringify({...validationSummary, invalid: invalidRows.length}));
        window.localStorage.setItem('emailReport:subject', JSON.stringify(subject));
        
        // Save email campaign record for analytics
        const session = await getUserSession();
        if (session?.email) {
          const successCount = finalSendStatus.filter(s => s.status === 'Sent').length;
          const failureCount = finalSendStatus.filter(s => s.status === 'Failed').length;
          const totalRecipients = validRows.length;
          
          const emailRecord = {
            id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: session.email,
            subject: subject,
            sentAt: new Date().toISOString(),
            recipientCount: totalRecipients,
            successCount: successCount,
            failureCount: failureCount,
            status: successCount === totalRecipients ? 'success' : (successCount > 0 ? 'partial' : 'failed'),
            senderEmail: session.email,
          };
          
          console.log('Saving email record:', emailRecord);
          
          // Get existing records and add new one
          const existingRecords = JSON.parse(window.localStorage.getItem('emailHistory:records') || '[]');
          existingRecords.unshift(emailRecord); // Add to beginning
          window.localStorage.setItem('emailHistory:records', JSON.stringify(existingRecords));
          
          console.log('Total email records saved:', existingRecords.length);
        }
        
        router.push('/dashboard');
    }

    setCurrentlySendingTo('');
    toast({ title: "Dispatch Complete", description: `Processed ${validRows.length} emails.` });
    setIsSending(false);
  };
  
  const handleSendTest = async () => {
    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
        toast({ variant: 'destructive', title: 'Invalid Email', description: 'Please enter a valid email address to send a test.' });
        return;
    }
    setIsSendingTest(true);
    setTestEmailSent(false);
    
    const currentTemplate = editorRef.current?.value || rawTemplate;
    setRawTemplate(currentTemplate);

    const firstRow = validRows[0] || csvData[0] || {};
    const html = generateEmailBody(currentTemplate, firstRow);
    
    const attachmentData = await Promise.all(
        attachments.map(async (file) => ({
            filename: file.name,
            content: await fileToBase64(file),
            contentType: file.type,
        }))
    );

    if (bannerImage) {
        attachmentData.push({
            filename: bannerImageName,
            content: bannerImage.split(',')[1],
            contentType: bannerImage.match(/data:(.*);/)?.[1] || 'image/png',
            cid: 'banner-image',
        });
    }

    const result = await sendEmail({ to: testEmail, subject, html, attachments: attachmentData });
    
    if (result.success) {
      toast({ title: "Test Email Sent", description: `A test email has been sent to ${testEmail}. Please check your inbox and approve.` });
      setTestEmailSent(true);
    } else {
      toast({ variant: 'destructive', title: "Test Email Failed", description: result.error });
    }
    setIsSendingTest(false);
  };

  const resetAll = () => {
    if (typeof window !== 'undefined') {
        Object.keys(window.localStorage).forEach(key => {
            if (key.startsWith('emailDispatcher:') || key.startsWith('emailReport:')) {
                window.localStorage.removeItem(key);
            }
        });
        // Clear attachments and banner
        setAttachments([]);
        setBannerImage(null);
        setBannerImageName('');
        window.location.reload();
    }
  };
  
  const handleSendAttempt = () => {
    if (!testEmailApproved) {
        setCurrentReviewTab('preview');
        setShowTestReminder(true);
        setTimeout(() => setShowTestReminder(false), 3000);
    }
  };

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    if(step === 1) setStep(2);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = e.target.value;
    setSubject(newSubject);
     if (step === 2 && newSubject && rawTemplate) {
        setStep(3);
    }
  }
  
  const handleSubjectBlur = () => {
    if (step === 2 && subject && rawTemplate) setStep(3);
  }

  const handleEditorBlur = () => {
    if(editorRef.current) {
      const currentTemplate = editorRef.current.value;
      setRawTemplate(currentTemplate);
      if(step === 2 && subject && currentTemplate) setStep(3);
    }
  };

  const approveTest = () => {
    setTestEmailApproved(true);
  }

  const removeFile = (type: 'template' | 'csv') => {
    if (type === 'template') {
        setRawTemplate('');
        setTemplateFileName('');
    } else if (type === 'csv') {
        setCsvData([]);
        setCsvHeaders([]);
        setCsvFileName('');
    }
  };

  const [userName, setUserName] = useState<string>('');
  
  // Fetch user session to get profile name
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const session = await getUserSession();
        if (session?.name) {
          setUserName(session.name);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {userName && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 rounded-lg p-4 flex items-center"
        >
          <User className="h-5 w-5 mr-3 text-primary" />
          <div>
            <h2 className="font-medium text-lg">Welcome, {userName}!</h2>
            <p className="text-sm text-muted-foreground">Ready to create and send your email campaign?</p>
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary-foreground">Email Dispatcher</h1>
        <Button onClick={resetAll} variant="outline" size="sm"><Redo className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
      
      <StepCard title="Step 1: Select Mode" description="Choose how emails will be sent." step={1} currentStep={step}>
        <RadioGroup value={mode || ''} onValueChange={(value) => handleModeSelect(value as Mode)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RadioGroupItem value="personalized" id="personalized" className="peer sr-only" />
            <Label htmlFor="personalized" className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/20 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
              <Mail className="mb-3 h-6 w-6" />
              Personalized
              <span className="text-xs text-center text-muted-foreground mt-1">Each email is customized with attributes from your CSV file.</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="bcc" id="bcc" className="peer sr-only" />
            <Label htmlFor="bcc" className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/20 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
              <Users className="mb-3 h-6 w-6" />
              Bulk email Send
              <span className="text-xs text-center text-muted-foreground mt-1">Send the exact same email to all recipients using BCC. No personalization.</span>
            </Label>
          </div>
        </RadioGroup>
        {mode === 'bcc' && templatePlaceholders.length > 0 && (
             <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Template Mismatch</AlertTitle>
                <AlertDescription>Your template contains placeholders, but Bulk BCC mode does not support personalization. Please remove placeholders or choose Personalized mode.</AlertDescription>
            </Alert>
        )}
      </StepCard>

      <StepCard title="Step 2: Compose Email" description="Set the subject and upload your email body." step={2} currentStep={step}>
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <div className="flex gap-2">
                <Input id="subject" value={subject} onChange={handleSubjectChange} onBlur={handleSubjectBlur} placeholder="e.g., Your Weekly Update"/>
                <SubjectOptimizer
                  emailContent={rawTemplate}
                  onSelectSubject={(selected) => {
                    setSubject(selected);
                    if (step === 2 && selected && rawTemplate) setStep(3);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
                <Label>Email Template (.txt or .md)</Label>
                {templateFileName ? (
                    <div className="flex items-center justify-between p-3 pl-4 bg-muted/30 rounded-lg border">
                        <span className="text-sm font-medium">{templateFileName}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile('template')}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ) : (
                    <>
                        <Label htmlFor="template-upload">
                            <FileDropzone
                                onFileSelect={(file) => processFile(file, 'template')}
                                accept=".txt,.md"
                                label="Click or drag to upload template"
                                description="Please provide a .txt or .md file"
                            />
                        </Label>
                        <Input id="template-upload" type="file" accept=".txt,.md" className="sr-only" onChange={(e) => handleFileChange(e, 'template')} />
                    </>
                )}
            </div>
        </div>
      </StepCard>

      <StepCard title="Step 3: Upload Recipients" description="Provide a CSV file with an 'Email' column." step={3} currentStep={step}>
        {csvFileName ? (
            <div className="flex items-center justify-between p-3 pl-4 mb-4 bg-muted/30 rounded-lg border">
                <span className="text-sm font-medium">{csvFileName}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile('csv')}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                </Button>
            </div>
        ) : (
            <>
                <Label htmlFor="csv-upload">
                    <FileDropzone
                        onFileSelect={(file) => processFile(file, 'csv')}
                        accept=".csv"
                        label="Click or drag to upload CSV"
                        description="File must be .csv and contain an 'Email' column"
                    />
                </Label>
                <Input id="csv-upload" type="file" accept=".csv" className="sr-only" onChange={(e) => handleFileChange(e, 'csv')} />
            </>
        )}
        
        {validationSummary && (
        <div className="mt-6 space-y-4">
            {validationSummary.missingColumns.length > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Missing CSV Columns!</AlertTitle>
                    <AlertDescription>Your template requires these columns which are missing from the CSV: <strong>{validationSummary.missingColumns.join(', ')}</strong>. Please update your CSV.</AlertDescription>
                </Alert>
            )}
            {validationSummary.extraColumns.length > 0 && (
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Extra CSV Columns</AlertTitle>
                    <AlertDescription>Note: These columns are in your CSV but not used in the template: {validationSummary.extraColumns.join(', ')}</AlertDescription>
                </Alert>
            )}
            {validationSummary.invalid > 0 && (
                <Card>
                    <CardHeader><CardTitle>Rows with Issues ({validationSummary.invalid})</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">These rows have missing or invalid data and will be skipped. Here's a preview:</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Missing/Invalid Fields</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invalidRows.slice(0, 5).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.Email}</TableCell>
                                        <TableCell><span className="text-destructive">{row.missingFields.join(', ')}</span></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
        )}
      </StepCard>
      
      <StepCard title="Step 4: Review and Send" description="Final check before dispatching the emails." step={4} currentStep={step}>
        <div className="space-y-6">
            <div className="border-b">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setCurrentReviewTab('editor')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${currentReviewTab === 'editor' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        Template Editor
                    </button>
                    <button
                        onClick={() => setCurrentReviewTab('preview')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${currentReviewTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        Live Preview &amp; Test
                    </button>
                </nav>
            </div>
            
            <div style={{ display: currentReviewTab === 'editor' ? 'block' : 'none' }}>
                 <div className="space-y-4">
                    {mode === 'personalized' && templatePlaceholders.length > 0 && (
                       <div className="p-4 rounded-lg bg-transparent border border-border">
                           <h3 className="font-semibold mb-2 text-foreground">Available Placeholders</h3>
                           <p className="text-sm text-muted-foreground mb-4">
                              Click to copy a placeholder. Placeholders are detected from your template.
                          </p>
                          <div className="flex flex-wrap gap-2">
                              {templatePlaceholders.map(ph => 
                                   <Badge 
                                       key={ph} 
                                       variant="outline"
                                       className="font-mono text-sm border-2 border-solid border-primary/50 bg-transparent hover:bg-primary/20 hover:text-primary-foreground cursor-pointer"
                                       onClick={() => navigator.clipboard.writeText(`<${ph}>`)}
                                       title={`Click to copy <${ph}>`}
                                   >
                                       {ph}
                                   </Badge>
                               )}
                          </div>
                      </div>
                    )}
                    <div className="flex items-center flex-wrap gap-1 rounded-t-md border border-b-0 p-2 bg-muted/20">
                         <div className="relative">
                            <Button asChild variant="ghost" size="sm" className={attachments.length > 0 ? "bg-primary/10" : ""}>
                                <Label htmlFor="attachment-upload" title="Attach File">
                                  <Paperclip className="h-4 w-4"/>
                                  {attachments.length > 0 && (
                                    <Badge variant="default" className="ml-1 h-5 px-1 text-xs">
                                      {attachments.length}
                                    </Badge>
                                  )}
                                </Label>
                            </Button>
                            <Input id="attachment-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'attachment')} multiple />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowBannerEditor(!showBannerEditor)} title="Toggle Banner Image" className={bannerImage ? "bg-primary/10" : ""}>
                            <ImageIcon className="h-4 w-4" />
                            {bannerImage && (
                              <Badge variant="default" className="ml-1 h-5 px-1 text-xs">
                                1
                              </Badge>
                            )}
                        </Button>
                         <Input id="banner-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e, 'banner')} />
                    </div>
                    <div className="relative">
                        <AnimatePresence>
                        {showBannerEditor && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <Label htmlFor="banner-upload" className="block cursor-pointer">
                                    <div className="w-full h-[150px] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors overflow-hidden">
                                        {!bannerImage ? (
                                            <div className="text-center p-6">
                                                <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto" />
                                                <span className="mt-2 block text-sm font-medium">Click to upload a banner</span>
                                                <span className="text-xs text-muted-foreground">Recommended size: 600px wide</span>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full group">
                                                <Image src={bannerImage} alt="Email Banner" fill style={{objectFit: "contain"}} className="p-2" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                    <Button variant="destructive" size="sm" onClick={(e) => { e.preventDefault(); setBannerImage(null); setBannerImageName(''); }}>
                                                        <Trash2 className="h-4 w-4 mr-2"/> Remove Banner
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Label>
                            </motion.div>
                        )}
                        </AnimatePresence>
                         <Textarea
                            ref={editorRef}
                            value={rawTemplate}
                            onChange={(e) => setRawTemplate(e.target.value)}
                            onBlur={handleEditorBlur}
                            className="min-h-[300px] w-full rounded-md rounded-t-none border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            placeholder="Type or paste your email template here..."
                         />
                    </div>
                    {attachments.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <Label className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments ({attachments.length}):
                            </Label>
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md border border-border/50 hover:bg-muted transition-colors group">
                                    <span className="font-medium">{file.name}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                        onClick={() => setAttachments((atts) => atts.filter((_: any, idx: number) => idx !== i))}
                                        title={`Remove ${file.name}`}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1"/>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div style={{ display: currentReviewTab === 'preview' ? 'block' : 'none' }}>
                <div className="space-y-4">
                    <Label>Live Preview (using first valid row)</Label>
                    <div className="border rounded-md p-4 min-h-[300px] bg-card">
                         <div dangerouslySetInnerHTML={{ __html: previewBody }} />
                    </div>
                     <AnimatePresence>
                        {showTestReminder && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert variant="destructive" className="border-yellow-500/50 text-yellow-500 [&gt;svg]:text-yellow-500">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Approval Required!</AlertTitle>
                                    <AlertDescription>Please send a test email and approve it below before dispatching.</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div>
                         <Label>1. Send a test email to yourself</Label>
                         <div className="flex gap-2 mt-2">
                             <Input
                                 type="email"
                                 placeholder="your.email@example.com"
                                 value={testEmail}
                                 onChange={(e) => setTestEmail(e.target.value)}
                                 disabled={isSendingTest || testEmailApproved}
                            />
                             <Button onClick={handleSendTest} disabled={isSendingTest || !testEmail || testEmailApproved}>
                                 {isSendingTest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                 {isSendingTest ? "Sending..." : "Send Test"}
                             </Button>
                         </div>
                     </div>
                     <div>
                        <Label>2. Approve the test email</Label>
                        <div className="mt-2">
                            <Button 
                                onClick={approveTest} 
                                disabled={testEmailApproved || isSendingTest || !testEmailSent}
                                className={testEmailApproved ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                {testEmailApproved ? 'Approved!' : 'Approve for Sending'}
                            </Button>
                            {testEmailApproved && <p className="text-sm text-green-500 mt-2">You're cleared for takeoff! You can now send the bulk email.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {isSending && (
                <div>
                     <h3 className="text-lg font-semibold font-headline mb-4">Dispatching Emails...</h3>
                     <div className="space-y-4">
                         <Progress value={progress} className="w-full h-2" />
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={currentlySendingTo}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-muted-foreground font-mono"
                            >
                                {currentlySendingTo ? `Sending to: ${currentlySendingTo}` : (progress < 100 ? 'Preparing to send...' : 'Dispatch complete!')}
                            </motion.div>
                         </AnimatePresence>
                         <div className="flex justify-between text-sm font-mono">
                             <span>Sent: {sendStatus.filter(s => s.status === 'Sent').length}</span>
                             <span className="text-destructive">Failed: {sendStatus.filter(s => s.status === 'Failed').length}</span>
                             <span>Total: {sendStatus.length} / {validRows.length}</span>
                         </div>
                     </div>
                </div>
            )}
            
            {!isSending && step === 4 && (
                <div className="border-t pt-6">
                    {!testEmailApproved && (
                        <Alert variant="default" className="mb-4 bg-primary/10 border-primary/30">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">Final Step: Approval</AlertTitle>
                            <AlertDescription>
                                To prevent accidental sends, please send a test email to yourself and approve it in the
                                <button onClick={() => setCurrentReviewTab('preview')} className="font-bold underline mx-1">Live Preview &amp; Test</button>
                                tab.
                            </AlertDescription>
                        </Alert>
                    )}
                    <AlertDialog>
                         <AlertDialogTrigger asChild>
                             <Button size="lg" disabled={validRows.length === 0 || !testEmailApproved} onClick={handleSendAttempt}>
                                <Rocket className="mr-2 h-5 w-5" />
                                Send {validRows.length > 0 ? `${validRows.length} Emails` : 'Emails'}
                            </Button>
                        </AlertDialogTrigger>
                        {testEmailApproved ? (
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Dispatch</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to send <strong className="text-foreground">{validRows.length}</strong> emails. This action is irreversible.
                                        <br/><br/>
                                        <strong>Subject:</strong> {subject}
                                        <br/>
                                        {bannerImageName && <><strong>Banner:</strong> {bannerImageName}<br/></>}
                                        {attachments.length > 0 && <><strong>Attachments:</strong> {attachments.map((f:any)=>f.name).join(', ')}</>}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSend} disabled={isSending}>Proceed to Launch</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        ) : (
                           // This content is not shown, but keeps the dialog from erroring when not approved
                           <AlertDialogContent> 
                               <AlertDialogHeader>
                                    <AlertDialogTitle>Approval Required</AlertDialogTitle>
                                    <AlertDialogDescription>
                                       Please send a test email and approve it before sending the campaign. You can do this in the "Live Preview & Test" tab.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                               <AlertDialogFooter>
                                   <AlertDialogAction onClick={()=> setCurrentReviewTab('preview')}>Go to Test</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                        )}
                    </AlertDialog>
                    {validRows.length === 0 && csvData.length > 0 && <p className="text-sm text-destructive mt-2">Cannot send: No valid recipient rows found.</p>}
                </div>
            )}
        </div>
      </StepCard>
    </div>
  );
}
    
    

    


