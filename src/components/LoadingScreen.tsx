'use client';

import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="text-3xl sm:text-4xl font-bold font-headline text-primary">
          ZapSend AI
        </div>

        {/* Loading Spinner - 1.5 second animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
