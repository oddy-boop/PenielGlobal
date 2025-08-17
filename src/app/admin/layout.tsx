
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Image as ImageIcon, LogOut, LayoutDashboard, Laptop, Home, MessageSquare, Phone, DollarSign, Shield } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { Branding } from "@/lib/types";
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState("/placeholder-logo.svg");

  useEffect(() => {
    const fetchBranding = async () => {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'branding')
            .single();

        if (data && data.content) {
            const branding = data.content as Branding;
            if (branding.logoUrl) setLogoUrl(branding.logoUrl);
        }
    };
    fetchBranding();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
    router.push('/login');
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 p-2 pr-3">
          <Button asChild variant="ghost" className='w-full justify-start p-1 h-auto'>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                  <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={32} height={32} />
                  <span className="font-headline text-xl group-data-[collapsible=icon]:hidden">PGM</span>
              </Link>
          </Button>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminNavLinks.map(link => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton isActive={pathname === link.href} tooltip={link.label}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopLeftContent() {
    const { isMobile } = useSidebar();

    return (
        <div className={cn("flex items-center", isMobile ? "w-full justify-between" : "")}>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="md:hidden font-headline text-xl text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Admin
              </div>
            </div>
            <div/>
        </div>
    )
}

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/home', label: 'Home Page', icon: Home },
  { href: '/admin/logo', label: 'Church Logo', icon: ImageIcon },
  { href: '/admin/sermons', label: 'Sermons', icon: Video },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/daily-inspiration', label: 'Inspirations', icon: MessageSquare },
  { href: '/admin/online-meeting', label: 'Online Meeting', icon: Laptop },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
  { href: '/admin/contact', label: 'Contact Page', icon: Phone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      )
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
                <TopLeftContent />
            </div>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
