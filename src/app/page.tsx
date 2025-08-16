import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Church, Clock, Calendar, ArrowRight, Video, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-cover bg-center flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Church congregation"
          layout="fill"
          objectFit="cover"
          className="z-0 brightness-50"
          data-ai-hint="church congregation"
        />
        <div className="z-10 p-4 max-w-4xl">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Welcome to Peniel Church Global
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            A place of faith, hope, and community. Join us to worship and grow together.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/events">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Events
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">
                Visit Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section id="service-times" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
            Join Our Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We gather every week to celebrate, worship, and learn from the Word.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Clock className="h-8 w-8 text-accent" />
                  Sunday Worship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Sunday at 10:00 AM</p>
                <p className="text-muted-foreground">In-person & Online</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Rss className="h-8 w-8 text-accent" />
                  Midweek Bible Study
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Wednesday at 7:00 PM</p>
                <p className="text-muted-foreground">Online via Zoom</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Church className="h-8 w-8 text-accent" />
                  Youth Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Friday at 6:30 PM</p>
                <p className="text-muted-foreground">At the church hall</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* About Us Snippet */}
      <section id="about" className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Church interior"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              data-ai-hint="church interior"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
              Our Community of Faith
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Peniel Church Global is more than just a building; we are a family. Our mission is to spread love, compassion, and the teachings of the gospel. We are committed to making a positive impact in our community and beyond.
            </p>
            <Button asChild className="mt-6" variant="link" size="lg">
              <Link href="/contact">Learn More About Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Sermons */}
      <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">Latest Message</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get inspired by our recent sermon on faith and perseverance.
              </p>
              <div className="mt-12 max-w-2xl mx-auto">
                  <Card className="shadow-lg overflow-hidden">
                      <div className="relative">
                          <Image src="https://placehold.co/800x450.png" alt="Sermon thumbnail" width={800} height={450} className="w-full" data-ai-hint="sermon abstract"/>
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Button variant="ghost" className="text-white h-20 w-20 hover:bg-white/20">
                                <Video className="h-12 w-12"/>
                                <span className="sr-only">Play Sermon</span>
                              </Button>
                          </div>
                      </div>
                      <CardContent className="p-6 text-left">
                          <CardTitle className="font-headline text-2xl">The Power of Unwavering Faith</CardTitle>
                          <p className="text-muted-foreground mt-2">Speaker: Pastor John Doe</p>
                          <Button asChild className="mt-4">
                              <Link href="/sermons">
                                  Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>
    </div>
  );
}
