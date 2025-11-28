"use client";

import React from 'react';
import { EmailDispatcher } from '@/components/email-sender/EmailDispatcher';
import { Header } from '@/components/email-sender/Header';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <EmailDispatcher />
            </main>
        </div>
    );
}
