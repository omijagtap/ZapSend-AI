'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/app/actions';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginAndRedirect = async () => {
      try {
        const session = await getUserSession();

        if (session?.email) {
          // User is logged in, go to dashboard
          router.replace('/dashboard');
        } else {
          // User not logged in, go to home/landing page
          router.replace('/home');
        }
      } catch (error) {
        // No session, go to home
        router.replace('/home');
      }
    };

    checkLoginAndRedirect();
  }, [router]);

  // Show loading while checking
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F23E36]"></div>
    </div>
  );
}
