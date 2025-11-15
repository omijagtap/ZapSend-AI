
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getSubjectSuggestions } from '@/app/actions';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';

interface SubjectOptimizerProps {
  emailContent: string;
  onSelectSubject: (subject: string) => void;
}

export function SubjectOptimizer({ emailContent, onSelectSubject }: SubjectOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!emailContent) {
      toast({
        variant: 'destructive',
        title: 'Cannot Generate Suggestions',
        description: 'Please provide email template content first.',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await getSubjectSuggestions({ emailContent });
      setSuggestions(result);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate subject line suggestions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (suggestion: string) => {
    onSelectSubject(suggestion);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Optimize Subject with AI">
          <Wand2 className="h-4 w-4" />
          <span className="sr-only">Optimize Subject</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary" />
            AI Subject Line Optimizer
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate optimized subject lines based on your email content to improve open rates.
          </p>
          <Button onClick={handleGenerate} disabled={isLoading || !emailContent}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Suggestions:</h4>
              <div className="flex flex-col gap-2">
                {suggestions.map((s, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto whitespace-normal bg-transparent"
                    onClick={() => handleSelect(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
