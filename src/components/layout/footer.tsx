
"use client";

import { Church, Facebook, Twitter, Youtube, Share2, Instagram } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Branding, ContactContent } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";


// Helper to get the correct icon component
const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return Facebook;
    case 'twitter': return Twitter;
    case 'youtube': return Youtube;
    case 'instagram': return Instagram;
    default: return Share2;
  }
}

export function Footer() {
  const pathname = usePathname();
  const [branding, setBranding] = useState<Branding | null>(null);
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
        setIsLoading(true);
        const [brandingRes, contactRes] = await Promise.all([
            supabase.from('site_content').select('content').eq('key', 'branding').single(),
            supabase.from('site_content').select('content').eq('key', 'contact').single()
        ]);

        if (brandingRes.data?.content) {
            setBranding(brandingRes.data.content as Branding);
        }
        if (contactRes.data?.content) {
            setContact(contactRes.data.content as ContactContent);
        }
        setIsLoading(false);
    };
    fetchFooterData();
  }, [])


  // Do not render footer on admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }
  
  const logoUrl = branding?.logoUrl || "/placeholder-logo.svg";

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-primary">
                {isLoading ? <Skeleton className="h-6 w-6 rounded-full" /> : (
                  <Image src={logoUrl} alt="Peniel Global Ministry Logo" width={24} height={24} />
                )}
              <span className="font-headline text-xl">Peniel Global Ministry</span>
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
                {isLoading ? (
                    <>
                        <Skeleton className="h-6 w-6"/>
                        <Skeleton className="h-6 w-6"/>
                        <Skeleton className="h-6 w-6"/>
                    </>
                ) : contact?.socials ? (
                    contact.socials.map(social => {
                        const Icon = getIcon(social.platform);
                        return (
                            <Link key={social.platform} href={social.url} className="text-muted-foreground hover:text-primary"><Icon/></Link>
                        )
                    })
                ) : null}
            </div>
            {isLoading ? (
                <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
            ): contact ? (
                 <>
                    <p className="mt-4 text-muted-foreground">{contact.addressLine1}, {contact.addressLine2}</p>
                    <p className="text-muted-foreground">{contact.generalEmail}</p>
                 </>
            ): null}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Peniel Global Ministry. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
