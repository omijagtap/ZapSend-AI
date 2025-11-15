'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/app/actions';
import { EmailDispatcher } from './EmailDispatcher';

type Session = {
    email: string;
    name?: string;
} | null;

export function AuthenticatedEmailDispatcher() {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      try {
        const userSession = await getUserSession();
        console.log('User session result:', userSession);
        
        if (!userSession?.email) {
          console.log('No valid session found, redirecting to login');
          setTimeout(() => {
            router.replace('/login');
          }, 1000);
          return;
        }
        
        console.log('Valid session found for:', userSession.email);
        setSession(userSession);
      } catch (error) {
        console.error('Auth check failed:', error);
        setTimeout(() => {
          router.replace('/login');
        }, 1000);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay before checking auth to ensure any cookies are set
    const timeoutId = setTimeout(checkAuth, 500);
    return () => clearTimeout(timeoutId);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!session?.email) {
    return null; // Will redirect
  }

  return <EmailDispatcher />;
}
