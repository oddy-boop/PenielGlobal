
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Activity, Video, ExternalLink, History } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ActivityLog, Event, Sermon } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const sermonsData = JSON.parse(localStorage.getItem('sermons_data') || '[]');
    setSermonCount(sermonsData.length);
    
    const eventsData = JSON.parse(localStorage.getItem('events_data') || '[]');
    setEventCount(eventsData.length);
    
    const activitiesData = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    setActivities(activitiesData);
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
              Total Events
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
             <div className="text-2xl font-bold">N/A</div>
             <p className="text-xs text-muted-foreground">
               Analytics not available in local mode
            </p>
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
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Donation tracking not available in local mode
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
