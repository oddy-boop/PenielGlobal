
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Share2, Loader2, Music, MessageCircle, Send } from "lucide-react";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useTransition } from "react";
import type { ContactContent } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { MotionWrapper } from "@/components/motion-wrapper";
import { TikTokIcon } from "@/components/icons/tiktok";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Helper to get the correct icon component
const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return Facebook;
    case 'twitter': return Twitter;
    case 'youtube': return Youtube;
    case 'instagram': return Instagram;
    case 'tiktok': return TikTokIcon;
    case 'spotify': return Music;
    case 'whatsapp': return MessageCircle;
    default: return Share2;
  }
}

export default function ContactPage() {
  const { toast } = useToast();
  const [content, setContent] = useState<ContactContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const { data, error } = await supabase.functions.invoke('contact', {
        body: { name, email, subject, message },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error sending message",
          description: error.message,
        });
      } else {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    });
  };

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'contact')
        .single();
      
      if (data?.content) {
        setContent(data.content as ContactContent);
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  const mapSrc = useMemo(() => {
    if (content?.latitude && content?.longitude) {
      return `https://maps.google.com/maps?q=${content.latitude},${content.longitude}&output=embed&z=15`;
    }
    if (content) {
        const fullAddress = encodeURIComponent(`${content.addressLine1}, ${content.addressLine2}`);
        return `https://maps.google.com/maps?q=${fullAddress}&output=embed&z=15`;
    }
    return "";
  }, [content]);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-primary">Contact Information Not Available</h2>
        <p className="text-muted-foreground mt-2">Please configure this page in the admin panel.</p>
      </div>
    );
  }
  

  return (
    <MotionWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <MapPin className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{content.addressLine1}</p>
                <p>{content.addressLine2}</p>
                <div className="mt-4 h-64 bg-muted rounded-lg overflow-hidden">
                  {mapSrc && (
                      <iframe
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={mapSrc}
                          className="border-0"
                      ></iframe>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Phone className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Main Office: {content.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Mail className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>General Inquiries: <a href={`mailto:${content.generalEmail}`} className="hover:underline">{content.generalEmail}</a></p>
                <p>Prayer Requests: <a href={`mailto:${content.prayerEmail}`} className="hover:underline">{content.prayerEmail}</a></p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Share2 className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline">Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                 {content.socials && content.socials.map(social => {
                    const Icon = getIcon(social.platform);
                    return (
                      <Link key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Icon size={24} /></Link>
                    )
                 })}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="p-6 md:p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={isPending} />
                    <Input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isPending}/>
                  </div>
                  <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required disabled={isPending}/>
                  <Textarea placeholder="Your Message" rows={6} value={message} onChange={e => setMessage(e.target.value)} required disabled={isPending}/>
                  <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                    {isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}

