'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserNav } from './UserNav';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserSession } from '@/app/actions';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getUserSession();
        setIsLoggedIn(!!session?.email);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    
    checkSession();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-background/80 backdrop-blur-sm border-b">
      <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity cursor-pointer">
        ZapSend AI
      </Link>
      
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <Button variant="ghost" asChild>
            <Link href="/analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics & History</span>
            </Link>
          </Button>
        )}
        <UserNav />
      </div>
    </header>
  );
}
