
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Activity, Video, History, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityLog, Donation, Event as EventType } from "@/lib/types";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type WeeklyDonations = {
  date: string;
  amount: number;
};

const chartConfig = {
  amount: {
    label: "Donations",
    color: "hsl(var(--accent))",
  },
  events: {
    label: "Events",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [weeklyDonations, setWeeklyDonations] = useState<WeeklyDonations[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Summary Cards Data
      const { count: sermonData } = await supabase.from('sermons').select('*', { count: 'exact', head: true });
      if (sermonData) setSermonCount(sermonData);

      const { count: eventData } = await supabase.from('events').select('*', { count: 'exact', head: true });
      if (eventData) setEventCount(eventData);

      const { data: donationsData, error: donationsError } = await supabase.from('donations').select('amount');
      if (donationsData) {
        const total = donationsData.reduce((sum, current) => sum + current.amount, 0);
        setTotalDonations(total);
      }

      // Recent Activity
      const { data: activitiesData } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(5);
      if (activitiesData) setActivities(activitiesData);

      // Donations Chart Data (Last 7 days)
      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);
      const { data: recentDonations, error: recentDonationsError } = await supabase
        .from('donations')
        .select('amount, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());
      
      if (recentDonations) {
        const interval = eachDayOfInterval({ start: sevenDaysAgo, end: today });
        const dailyTotals = interval.map(day => ({
            date: format(day, 'MMM d'),
            amount: 0
        }));

        recentDonations.forEach(donation => {
            const donationDate = format(new Date(donation.created_at), 'MMM d');
            const dayData = dailyTotals.find(d => d.date === donationDate);
            if (dayData) {
                dayData.amount += donation.amount;
            }
        });
        setWeeklyDonations(dailyTotals);
      }

      // Upcoming Events Chart Data
      const { data: eventsData } = await supabase.from('events').select('*').gte('date', today.toISOString()).order('date', { ascending: true }).limit(5);
      if (eventsData) setUpcomingEvents(eventsData as EventType[]);

    };

    fetchData();
  }, []);

  const formattedUpcomingEvents = upcomingEvents.map(event => ({
    name: event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title,
    date: format(new Date(event.date), 'MMM d'),
    events: 1, // Dummy value to render a bar
    fullDate: format(new Date(event.date), 'PPP')
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your content management dashboard.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonCount}</div>
            <p className="text-xs text-muted-foreground">Sermons available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">Events scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">GHS {totalDonations.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">All-time giving</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Recent admin actions</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>A timeline of the next 5 scheduled events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={formattedUpcomingEvents} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                            <XAxis type="number" hide />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="p-2 bg-background border rounded-lg shadow-sm">
                                        <p className="font-bold">{payload[0].payload.name}</p>
                                        <p className="text-sm text-muted-foreground">{payload[0].payload.fullDate}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                            />
                            <Bar dataKey="events" layout="vertical" fill="hsl(var(--primary))" radius={4} barSize={20} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Donations This Week</CardTitle>
                    <CardDescription>Total donations collected over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart data={weeklyDonations} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                             <CartesianGrid vertical={false} />
                             <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                             <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `GHS ${value}`} />
                             <Tooltip content={<ChartTooltipContent />} />
                             <Line dataKey="amount" type="monotone" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>

       <div className="mt-8 grid grid-cols-1">
          <Card>
              <CardHeader>
                  <CardTitle>Recent Activity Log</CardTitle>
                  <CardDescription>A log of the most recent actions taken in the admin panel.</CardDescription>
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
                              {format(new Date(activity.timestamp!), "PPP, p")}
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
