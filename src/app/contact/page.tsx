import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Share2 } from "lucide-react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We would love to hear from you. Whether you have a question, a prayer request, or just want to say hello, feel free to reach out.
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
              <p>123 Faith Avenue</p>
              <p>Hope City, HC 12345</p>
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
              <p>Main Office: (123) 456-7890</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Mail className="h-8 w-8 text-accent" />
              <CardTitle className="font-headline">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>General Inquiries: contact@penielchurch.org</p>
              <p>Prayer Requests: prayer@penielchurch.org</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Share2 className="h-8 w-8 text-accent" />
              <CardTitle className="font-headline">Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
               <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary"><Facebook size={24} /></Link>
               <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary"><Twitter size={24} /></Link>
               <Link href="https://youtube.com" className="text-muted-foreground hover:text-primary"><Youtube size={24} /></Link>
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
