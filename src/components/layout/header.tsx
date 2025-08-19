
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import Image from "next/image";
import type { Branding } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/daily-inspiration", label: "Daily Inspiration" },
  { href: "/online-meeting", label: "Online Meeting" },
  { href: "/donations", label: "Donations" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [branding, setBranding] = useState<Branding>({});
  
  useEffect(() => {
    const fetchBranding = async () => {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'branding')
            .single();

        if (data && data.content) {
            setBranding(data.content as Branding);
        }
    };
    fetchBranding();
  }, []);

  // Do not render header on admin or login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const NavLink = ({ href, label, className }: { href: string; label:string, className?: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "transition-colors hover:text-primary z-10",
          isActive ? "text-primary font-semibold" : "text-muted-foreground",
          className
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  const logoUrl = branding.logoUrl || "/placeholder-logo.svg";
  const headerBgUrl = branding.headerBgUrl || "https://placehold.co/1200x200.png";


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
       <Image 
          src={headerBgUrl}
          alt="Header background"
          fill
          className="object-cover opacity-20 z-0"
          data-ai-hint="church interior abstract"
        />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative z-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={32} height={32} className="rounded-full" />
          <span className="font-headline text-xl">PGM</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card p-0">
                    <SheetHeader className="p-6 flex-row items-center justify-between">
                         <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                          <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={32} height={32} className="rounded-full" />
                          <span className="font-headline text-xl">PGM</span>
                        </Link>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </SheetClose>
                    </SheetHeader>
                  <nav className="flex flex-col space-y-4 p-6 text-lg">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} className="py-2" />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
