import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getEvents } from '@/api/events';
import type { ProjectSlot } from '@/types/planner';

export function useEventData() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const passedEventId = searchParams.get('eventId') || location.state?.eventId;
  const [projectSlots, setProjectSlots] = useState<ProjectSlot[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        if (!isMounted) return;
        const formatDateReadable = (dateString?: string) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return null;
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        };
        const isUUID = (str: string) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        const mapped = events.map((e: any) => {
          const rawClientId = e.clientId || e.client_id;
          const clientVal = e.clientRealName || e.clientName || rawClientId;
          const displayClient = clientVal && isUUID(clientVal) ? 'Valued Client' : clientVal;
          return {
            id: e.id,
            title: e.title || 'Untitled Event',
            startDate: formatDateReadable(e.startDate || e.eventDate) || 'No Date Set',
            endDate: formatDateReadable(e.endDate) || 'TBD',
            rawStartDate: e.startDate || e.eventDate || '',
            rawEndDate: e.endDate || '',
            eventTime: e.eventTime || e.startTime || '',
            eventType: e.eventType,
            eventPackage: e.eventPackage,
            eventPax: e.eventPax || 0,
            clientName: displayClient,
            clientId: rawClientId,
            clientRealName: e.clientRealName,
            eventCost: e.eventCost || e.cost,
          };
        });
        setProjectSlots(mapped);
        if (mapped.length > 0) {
          const targetId =
            passedEventId && mapped.some((p: any) => p.id === passedEventId)
              ? passedEventId
              : mapped[0].id;
          setSelectedEventId(targetId);
        }
      } catch (error) {
        console.error('Failed to fetch events for planner:', error);
      }
    };
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [passedEventId]);

  return { projectSlots, selectedEventId, setSelectedEventId };
}