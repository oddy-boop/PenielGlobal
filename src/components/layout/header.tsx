
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Church, Menu, X, Shield, DollarSign } from "lucide-react";
import Image from "next/image";

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

  // Do not render header on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const NavLink = ({ href, label, className }: { href: string; label: string, className?: string }) => {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
       <Image 
          src="https://placehold.co/1200x200.png" 
          alt="Header background"
          fill
          className="object-cover opacity-20 z-0"
          data-ai-hint="church interior abstract"
        />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative z-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Church className="h-6 w-6 text-accent" />
          <span className="font-headline text-xl">Peniel Church</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                <Link href="/admin">
                    <Shield className="h-5 w-5" />
                    <span className="sr-only">Admin</span>
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
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                          <Church className="h-6 w-6 text-accent" />
                          <span className="font-headline text-xl">Peniel Church</span>
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
                    <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Shield className="h-5 w-5" />
                        Admin
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
