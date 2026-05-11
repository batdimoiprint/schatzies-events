import { useState, useEffect } from 'react';
import { getEventById } from '@/api/events';
import { getEventUser } from '@/api/events';
import { getEventAllocation } from '@/api/events';
import { getCalendarEntries } from '@/api/calendar';
import { getEventFlow } from '@/api/events';
import { mapBackendFlowToUI } from '@/utils/planner-flow';
import type { ProjectSlot } from '@/types/planner';

export function useSelectedEvent(selectedEventId: string, projectSlots: ProjectSlot[]) {
  const [selectedEventDetails, setSelectedEventDetails] = useState<any>(null);
  const [currentClientName, setCurrentClientName] = useState('');
  const [eventAllocation, setEventAllocation] = useState<any>(null);
  const [eventMeetings, setEventMeetings] = useState<any[]>([]);
  const [overviewFlows, setOverviewFlows] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!selectedEventId) {
      setSelectedEventDetails(null);
      setCurrentClientName('');
      setEventAllocation(null);
      return;
    }

    getEventById(selectedEventId)
      .then((details) => {
        if (isMounted) setSelectedEventDetails(details);
      })
      .catch((e) => {
        console.error('Failed to fetch event details', e);
        if (isMounted) setSelectedEventDetails(null);
      });

    setCurrentClientName('');
    setEventAllocation(null);
    const selectedProject = projectSlots.find((p) => p.id === selectedEventId);
    if (selectedProject?.clientId) {
      getEventUser(selectedProject.clientId)
        .then((userData) => {
          if (isMounted) {
            setCurrentClientName(
              userData?.name ||
              userData?.firstName ||
              userData?.realName ||
              userData?.clientName ||
              ''
            );
          }
        })
        .catch((e: any) => {
          if (e?.response?.status !== 404) {
            console.error('Failed to fetch event user', e);
          }
          if (isMounted) setCurrentClientName('');
        });
    }

    getEventAllocation(selectedEventId)
      .then((allocationData) => {
        if (isMounted) setEventAllocation(allocationData);
      })
      .catch((e: any) => {
        if (e?.response?.status !== 404) {
          console.error('Failed to fetch event allocation', e);
        }
        if (isMounted) setEventAllocation(null);
      });

    getCalendarEntries()
      .then((entries) => {
        if (isMounted) {
          setEventMeetings(
            entries.filter(
              (item: any) =>
                item.eventId === selectedEventId && item.label?.toUpperCase() === 'MEETING'
            )
          );
        }
      })
      .catch((error) => {
        console.error('Failed to fetch meetings', error);
        if (isMounted) setEventMeetings([]);
      });

    getEventFlow(selectedEventId)
      .then((flowData) => {
        if (isMounted) {
          const mappedFlows = Array.isArray(flowData)
            ? flowData
              .map((item: any, index: number) => mapBackendFlowToUI(item, index))
              .sort((a: any, b: any) => a.startHour - b.startHour)
            : [];
          setOverviewFlows(mappedFlows);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch event flow for overview', error);
        if (isMounted) setOverviewFlows([]);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEventId, projectSlots]);

  return {
    selectedEventDetails,
    currentClientName,
    eventAllocation,
    eventMeetings,
    overviewFlows,
  };
}