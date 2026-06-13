import { useState, useEffect } from 'react';
import {
  getEventChecklist,
  updateEventChecklistItem,
  addEventChecklistItem,
  deleteEventChecklistItem,
} from '@/api/events';

export function useChecklist(selectedEventId: string) {
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [checklistDeleteTarget, setChecklistDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [checklistDeleteValidation, setChecklistDeleteValidation] = useState('');
  const [checklistDeleteError, setChecklistDeleteError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchChecklist = async () => {
      if (!selectedEventId) {
        setChecklistItems([]);
        return;
      }
      try {
        const checklistData = await getEventChecklist(selectedEventId);
        if (isMounted) setChecklistItems(checklistData || []);
      } catch (error) {
        console.error('Failed to load checklist:', error);
        if (isMounted) setChecklistItems([]);
      }
    };
    fetchChecklist();
    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const handleToggleChecklistItem = async (itemId: string, currentDone: boolean) => {
    if (!selectedEventId) return;
    const newDone = !currentDone;
    const targetItem = checklistItems.find((i) => i.id === itemId);
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, done: newDone } : item))
    );
    try {
      if (!String(itemId).startsWith('temp-')) {
        await updateEventChecklistItem(
          selectedEventId,
          'overall',
          itemId,
          newDone,
          targetItem?.label || 'Task'
        );
      }
    } catch (error) {
      setChecklistItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, done: currentDone } : item))
      );
      alert('Failed to update status.');
    }
  };

  const handleUpdateChecklistLabel = async (itemId: string, newLabel: string) => {
    try {
      const targetItem = checklistItems.find((i) => i.id === itemId);
      if (targetItem && !String(itemId).startsWith('temp-')) {
        await updateEventChecklistItem(
          selectedEventId,
          'overall',
          itemId,
          targetItem.done,
          newLabel
        );
      }
    } catch (error) {
      console.error('Failed to sync label update', error);
    }
  };

  const handleAddChecklistItem = async () => {
    if (!selectedEventId) return;
    try {
      await addEventChecklistItem(selectedEventId, 'New checklist item');
      const freshList = await getEventChecklist(selectedEventId);
      setChecklistItems(freshList || []);
    } catch (error) {
      alert('Failed to add checklist item.');
    }
  };

  const handleRemoveChecklistItem = async (itemId: string) => {
    if (!selectedEventId) return;
    const previousState = [...checklistItems];
    setChecklistItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      if (!String(itemId).startsWith('temp-')) {
        await deleteEventChecklistItem(selectedEventId, itemId);
      }
    } catch (error) {
      setChecklistItems(previousState);
      alert('Failed to delete item.');
    }
  };

  const openChecklistDeleteValidation = (item: { id: string; label: string }) => {
    setChecklistDeleteTarget(item);
    setChecklistDeleteValidation('');
    setChecklistDeleteError('');
  };

  const closeChecklistDeleteValidation = () => {
    setChecklistDeleteTarget(null);
    setChecklistDeleteValidation('');
    setChecklistDeleteError('');
  };

  const handleConfirmChecklistDelete = () => {
    if (!checklistDeleteTarget) return;
    const normalizedExpectedLabel = checklistDeleteTarget.label.trim().toLowerCase();
    const normalizedProvidedLabel = checklistDeleteValidation.trim().toLowerCase();
    if (!normalizedProvidedLabel || normalizedProvidedLabel !== normalizedExpectedLabel) {
      setChecklistDeleteError(`Type "${checklistDeleteTarget.label}" to confirm deletion.`);
      return;
    }
    handleRemoveChecklistItem(checklistDeleteTarget.id);
    closeChecklistDeleteValidation();
  };

  const checklistDoneCount = checklistItems.filter((it: any) => it.done).length;
  const checklistProgress = checklistItems.length
    ? Math.round((checklistDoneCount / checklistItems.length) * 100)
    : 0;

  return {
    checklistItems,
    setChecklistItems,
    checklistDoneCount,
    checklistProgress,
    handleToggleChecklistItem,
    handleUpdateChecklistLabel,
    handleAddChecklistItem,
    handleRemoveChecklistItem,
    checklistDeleteTarget,
    closeChecklistDeleteValidation,
    checklistDeleteValidation,
    setChecklistDeleteValidation,
    checklistDeleteError,
    openChecklistDeleteValidation,
    handleConfirmChecklistDelete,
  };
}
