'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logout, getUserSession } from '@/app/actions';
import { LogOut, User, BarChart3, Mail } from 'lucide-react';
import Link from 'next/link';

type Session = {
    email: string;
    name?: string;
} | null;

interface UserProfile {
  email: string;
  totalEmailsSent: number;
  totalCampaigns: number;
  lastLoginTime: string;
  firstLoginTime: string;
}

export function UserNav() {
  const [session, setSession] = useState<Session>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const userSession = await getUserSession();
        setSession(userSession);
        
        // Load user profile from localStorage
        if (userSession?.email && typeof window !== 'undefined') {
          const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
          if (userProfiles[userSession.email]) {
            setUserProfile(userProfiles[userSession.email]);
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="h-10 w-20 bg-muted animate-pulse rounded" />
    );
  }

  if (session?.email) {
    // Get initials from email for avatar
    const getInitials = (email: string) => {
      const name = email.split('@')[0];
      return name.slice(0, 2).toUpperCase();
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto px-3">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(session.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium leading-none">
                {session.name || session.email.split('@')[0]}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-1">
                {session.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.name || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          {userProfile && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-2 space-y-2 bg-muted/30 rounded-md mx-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Emails Sent</p>
                    <p className="text-sm font-semibold">{userProfile.totalEmailsSent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                    <p className="text-sm font-semibold">{userProfile.totalCampaigns}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If not logged in, show login button
  return (
    <Button variant="outline" onClick={() => window.location.href = '/login'}>
      <User className="mr-2 h-4 w-4" />
      Login
    </Button>
  );
}
