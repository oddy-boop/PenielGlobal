
import { InspirationClient } from "./inspiration-client";
import { MotionWrapper } from "@/components/motion-wrapper";

export default function DailyInspirationPage() {
  return (
    <MotionWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Daily Inspiration</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A moment for prayer, reflection, and encouragement from our community.
          </p>
        </div>
        <InspirationClient />
      </div>
    </MotionWrapper>
  );
}
