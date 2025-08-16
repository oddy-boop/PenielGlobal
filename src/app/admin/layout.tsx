
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Church, Video, Calendar, Image as ImageIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/logo', label: 'Church Logo', icon: ImageIcon },
  { href: '/admin/sermons', label: 'Sermons', icon: Video },
  { href: '/admin/events', label: 'Events', icon: Calendar },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 pr-0">
          <Button asChild variant="ghost" className='w-full justify-start'>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                  <Church className="h-6 w-6 text-accent" />
                  <span className="font-headline text-xl">Peniel Church</span>
              </Link>
          </Button>
          <SidebarTrigger />
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
                <Link href="/">
                    <SidebarMenuButton tooltip="Sign Out">
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function FloatingSidebarTrigger() {
    const { toggleSidebar, state } = useSidebar();
    if (state === 'expanded') return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 md:hidden">
             <Button size="icon" onClick={toggleSidebar}>
                <LayoutDashboard />
            </Button>
        </div>
    )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="md:hidden mb-4">
                <SidebarTrigger />
            </div>
            {children}
        </div>
      </SidebarInset>
      <FloatingSidebarTrigger />
    </SidebarProvider>
  );
}
