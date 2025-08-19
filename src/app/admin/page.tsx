

"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Activity, Video, History } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityLog } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const websiteTrafficData = [
  { date: "Mon", visits: 222 },
  { date: "Tue", visits: 345 },
  { date: "Wed", visits: 411 },
  { date: "Thu", visits: 389 },
  { date: "Fri", visits: 521 },
  { date: "Sat", visits: 630 },
  { date: "Sun", visits: 712 },
];

const donationsData = [
  { name: "Week 1", amount: 1250 },
  { name: "Week 2", amount: 1480 },
  { name: "Week 3", amount: 1100 },
  { name: "Week 4", amount: 1750 },
];

const chartConfig = {
  visits: {
    label: "Visits",
    color: "hsl(var(--primary))",
  },
  amount: {
    label: "Donations",
    color: "hsl(var(--accent))",
  }
};


export default function AdminDashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { count: sermonData } = await supabase
        .from('sermons')
        .select('*', { count: 'exact', head: true });
      if (sermonData) setSermonCount(sermonData);

      const { count: eventData } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      if (eventData) setEventCount(eventData);

      const { data: activitiesData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      if (activitiesData) setActivities(activitiesData);
    };

    fetchData();
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
             <div className="text-2xl font-bold">3,278</div>
             <p className="text-xs text-muted-foreground">
               +15.2% from last month
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
            <div className="text-2xl font-bold">$5,580</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Website Traffic</CardTitle>
                    <CardDescription>Visits this week</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart data={websiteTrafficData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line dataKey="visits" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Donations</CardTitle>
                    <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={donationsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                             <CartesianGrid vertical={false} />
                             <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                             <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value/1000}k`} />
                             <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                             <Bar dataKey="amount" fill="hsl(var(--accent))" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>

       <div className="mt-8 grid grid-cols-1">
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
                              {formatDistanceToNow(new Date(activity.timestamp!), { addSuffix: true })}
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
