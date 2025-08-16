import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Share2 } from "lucide-react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  // In a real app, you would fetch this data from Firestore
  const contactInfo = {
    intro: "We would love to hear from you. Whether you have a question, a prayer request, or just want to say hello, feel free to reach out.",
    addressLine1: "123 Faith Avenue",
    addressLine2: "Hope City, HC 12345",
    phone: "(123) 456-7890",
    generalEmail: "contact@penielchurch.org",
    prayerEmail: "prayer@penielchurch.org",
    socials: [
        { platform: "Facebook", url: "https://facebook.com", icon: Facebook },
        { platform: "Twitter", url: "https://twitter.com", icon: Twitter },
        { platform: "Youtube", url: "https://youtube.com", icon: Youtube },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {contactInfo.intro}
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
              <p>{contactInfo.addressLine1}</p>
              <p>{contactInfo.addressLine2}</p>
              <div className="mt-4 h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map Placeholder</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Phone className="h-8 w-8 text-accent" />
              <CardTitle className="font-headline">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Main Office: {contactInfo.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Mail className="h-8 w-8 text-accent" />
              <CardTitle className="font-headline">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>General Inquiries: {contactInfo.generalEmail}</p>
              <p>Prayer Requests: {contactInfo.prayerEmail}</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Share2 className="h-8 w-8 text-accent" />
              <CardTitle className="font-headline">Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
               {contactInfo.socials.map(social => (
                 <Link key={social.platform} href={social.url} className="text-muted-foreground hover:text-primary"><social.icon size={24} /></Link>
               ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="p-6 md:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={6} />
                <Button type="submit" size="lg" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
