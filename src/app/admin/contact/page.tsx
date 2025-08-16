
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPageManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Contact Page Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update the contact details displayed on the public contact page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address-line1">Address Line 1</Label>
            <Input id="address-line1" defaultValue="123 Faith Avenue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address-line2">Address Line 2</Label>
            <Input id="address-line2" defaultValue="Hope City, HC 12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" defaultValue="(123) 456-7890" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email-general">General Inquiries Email</Label>
            <Input id="email-general" type="email" defaultValue="contact@penielchurch.org" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email-prayer">Prayer Requests Email</Label>
            <Input id="email-prayer" type="email" defaultValue="prayer@penielchurch.org" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="page-intro">Introductory Text</Label>
            <Textarea id="page-intro" defaultValue="We would love to hear from you. Whether you have a question, a prayer request, or just want to say hello, feel free to reach out." />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
