
"use client";

import { Church, Facebook, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Do not render footer on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-primary">
              <Church className="h-6 w-6 text-accent" />
              <span className="font-headline text-xl">Peniel Church Global</span>
            </Link>
            <p className="mt-2 text-muted-foreground">
              Faith. Hope. Community.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="mt-2 space-y-1">
              <li><Link href="/sermons" className="text-muted-foreground hover:text-primary">Sermons</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/donations" className="text-muted-foreground hover:text-primary">Donations</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
            </div>
            <p className="mt-4 text-muted-foreground">123 Faith Avenue, Hope City, 12345</p>
            <p className="text-muted-foreground">contact@penielchurch.org</p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Peniel Church Global. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
