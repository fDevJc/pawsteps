'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { Database } from '@/types/supabase';

type Activity = Database['public']['Tables']['activities']['Row'];

interface ActivityTimelineProps {
  initialActivities: Activity[];
  familyId: string;
}

export default function ActivityTimeline({ initialActivities, familyId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [mounted, setMounted] = useState(false); // New mounted state
  const supabase = createClient();

  useEffect(() => {
    setMounted(true); // Set mounted to true after first render
    console.log('ActivityTimeline: useEffect running for familyId:', familyId);
    console.log('ActivityTimeline: Current familyId prop:', familyId); // Added log
    // Set up Realtime subscription
    const channel = supabase
      .channel('activities_channel') // Unique channel name
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'activities',
          filter: `family_id=eq.${familyId}`, // Filter by family_id
        },
        (payload) => {
          console.log('ActivityTimeline: Realtime event received:', payload);
          // Handle real-time changes
          if (payload.eventType === 'INSERT') {
            console.log('ActivityTimeline: INSERT event, new record:', payload.new);
            console.log('ActivityTimeline: payload.new.family_id:', (payload.new as Activity).family_id);
            console.log('ActivityTimeline: Component familyId prop:', familyId);
            setActivities((prev) => [payload.new as Activity, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('ActivityTimeline: UPDATE event, updated record:', payload.new);
            setActivities((prev) =>
              prev.map((activity) =>
                activity.id === (payload.new as Activity).id ? (payload.new as Activity) : activity
              )
            );
          } else if (payload.eventType === 'DELETE') {
            console.log('ActivityTimeline: DELETE event, old record:', payload.old);
            setActivities((prev) =>
              prev.filter((activity) => activity.id !== (payload.old as Activity).id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('ActivityTimeline: Channel status changed:', status);
      });

    // Cleanup subscription on component unmount
    return () => {
      console.log('ActivityTimeline: Cleaning up Realtime subscription for familyId:', familyId);
      supabase.removeChannel(channel);
    };
  }, [supabase, familyId]); // Re-subscribe if supabase client or familyId changes

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      {activities.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No activities recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b border-gray-100 dark:border-zinc-700 pb-3 last:border-b-0">
              <p className="font-medium">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}{' '}
                {activity.note && `(${activity.note})`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mounted ? new Date(activity.created_at).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }) : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
