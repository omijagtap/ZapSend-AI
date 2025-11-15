import { EmailDispatcher } from '@/components/email-sender/EmailDispatcher';
import { Header } from '@/components/email-sender/Header';
import { getUserSession } from '@/app/actions';
import { redirect } from 'next/navigation';
import PixelBlast from '@/components/PixelBlast';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Home() {
  // Add minimum loading delay to show loading animation
  const [session] = await Promise.all([
    getUserSession(),
    delay(500) // 0.5 second minimum loading time
  ]);
  
  // If not logged in, redirect to login page
  if (!session?.email) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <PixelBlast 
        variant="circle"
        pixelSize={4}
        color="#8B5CF6"
        opacity={0.35}
        speed={0.6}
        enableRipples
        liquid
        transparent
        patternDensity={1.3}
        liquidStrength={0.1}
      />
      <div className="relative z-10">
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <EmailDispatcher />
        </main>
      </div>
    </div>
  );
}
