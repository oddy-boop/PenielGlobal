
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import Image from "next/image";
import type { Branding } from "@/lib/types";

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
    // On component mount, read from localStorage
    const storedBranding = localStorage.getItem("branding_content");
    if (storedBranding) {
      setBranding(JSON.parse(storedBranding));
    }

    // Optional: listen for storage changes from other tabs
    const handleStorageChange = () => {
       const storedBranding = localStorage.getItem("branding_content");
       if (storedBranding) {
         setBranding(JSON.parse(storedBranding));
       }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
          <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={32} height={32} />
          <span className="font-headline text-xl">PGM</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                <Link href="/login">
                    <Shield className="h-5 w-5" />
                    <span className="sr-only">Admin Login</span>
                </Link>
            </Button>
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card p-0">
                    <div className="p-6 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                          <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={32} height={32} />
                          <span className="font-headline text-xl">PGM</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>
                  <nav className="flex flex-col space-y-4 p-6 text-lg">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} className="py-2" />
                    ))}
                    <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Shield className="h-5 w-5" />
                        Admin Login
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
