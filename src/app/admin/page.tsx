
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Activity, Video, ExternalLink, History } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ActivityLog } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const sermonsSnapshot = await getDocs(collection(db, "sermons"));
      setSermonCount(sermonsSnapshot.size);
      const eventsSnapshot = await getDocs(collection(db, "events"));
      setEventCount(eventsSnapshot.size);
    };

    const fetchActivities = async () => {
      const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const activitiesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
          } as ActivityLog
      });
      setActivities(activitiesData);
    };

    fetchCounts();
    fetchActivities();
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your content management dashboard.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sermons
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonCount}</div>
            <p className="text-xs text-muted-foreground">
              Sermons available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">
              Events scheduled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">View on Vercel</div>
             <Link href="https://vercel.com" target="_blank" className="text-xs text-muted-foreground flex items-center gap-1 hover:underline">
               Analytics available in your Vercel dashboard <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">External</div>
            <p className="text-xs text-muted-foreground">
              Track donations via your payment provider (e.g. Stripe, PayPal)
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8">
          <Card>
              <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map(activity => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="bg-muted rounded-full p-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent activity to display.</p>
                  )}
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
