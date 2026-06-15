import { useState, useEffect, type ChangeEvent, type DragEvent } from 'react';
import { getEventNotes, createEventNote, updateEventNote, deleteEventNote } from '@/api/events';
import type { PlannerQuickNote } from '@/types/planner';
import type { ApiError } from '@/types/api-error';

export function usePlannerNotes(selectedEventId: string) {
  const [plannerNotes, setPlannerNotes] = useState<PlannerQuickNote[]>([]);
  const [noteDraftTitle, setNoteDraftTitle] = useState('');
  const [noteDraftBody, setNoteDraftBody] = useState('');
  const [noteDraftImageDataUrl, setNoteDraftImageDataUrl] = useState<string | undefined>(undefined);
  const [noteDraftImageFile, setNoteDraftImageFile] = useState<File | null>(null);
  const [noteDraftError, setNoteDraftError] = useState('');
  const [editingPlannerNoteId, setEditingPlannerNoteId] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInlineNoteOpen, setIsInlineNoteOpen] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      if (!selectedEventId) {
        setPlannerNotes([]);
        return;
      }
      try {
        const notesResponse = await getEventNotes(selectedEventId);
        if (isMounted) setPlannerNotes(notesResponse);
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };
    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const resetNoteDraft = () => {
    setNoteDraftTitle('');
    setNoteDraftBody('');
    setNoteDraftImageDataUrl(undefined);
    setNoteDraftImageFile(null);
    setNoteDraftError('');
    setEditingPlannerNoteId(null);
  };

  const closePlannerNoteModal = () => {
    setIsNoteModalOpen(false);
    resetNoteDraft();
  };

  const handlePlannerNoteImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNoteDraftError('Please select an image file only.');
      event.target.value = '';
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setNoteDraftError('Image is too large. Please use a file under 100MB.');
      event.target.value = '';
      return;
    }
    setNoteDraftImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNoteDraftImageDataUrl(reader.result);
        setNoteDraftError('');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSavePlannerNote = async () => {
    const normalizedTitle = noteDraftTitle.trim();
    const normalizedBody = noteDraftBody.trim();
    if (!normalizedTitle && !normalizedBody && !noteDraftImageDataUrl) {
      if (isNoteModalOpen)
        setNoteDraftError('Enter a title, note detail, or add an image before saving.');
      return;
    }
    try {
      if (editingPlannerNoteId) {
        const updatedNote = await updateEventNote(
          selectedEventId,
          editingPlannerNoteId,
          {
            title: normalizedTitle || 'Untitled',
            body: normalizedBody || 'No details provided.',
            imageDataUrl: noteDraftImageDataUrl ?? undefined,
          },
          noteDraftImageFile
        );
        setPlannerNotes((prev) =>
          prev.map((n) => (n.id === editingPlannerNoteId ? updatedNote : n))
        );
      } else {
        const newNote = await createEventNote(
          selectedEventId,
          {
            title: normalizedTitle || 'Untitled',
            body: normalizedBody || 'No details provided.',
            imageDataUrl: noteDraftImageDataUrl ?? undefined,
          },
          noteDraftImageFile
        );
        setPlannerNotes((prev) => [newNote, ...prev]);
      }
      closePlannerNoteModal();
    } catch (error) {
      console.error('Failed to save planner note:', error);
      const apiErr = error as ApiError;
      let userMessage = 'Failed to save note. Please try again.';
      if (apiErr?.response) {
        const status = apiErr.response.status;
        const serverMsg = apiErr.response.data?.message || apiErr.response.data?.error;
        if (status === 500) userMessage = 'Server error: Unable to save note at this time.';
        else if (status === 400)
          userMessage = serverMsg ? `Bad request: ${serverMsg}` : 'Invalid note data.';
        else if (status === 404) userMessage = 'Event not found. Please refresh and try again.';
        else if (serverMsg) userMessage = `Error (${status}): ${serverMsg}`;
      } else if (apiErr?.message) {
        userMessage = `Network error: ${apiErr.message}`;
      }
      setNoteDraftError(userMessage);
    }
  };

  const handleCloseInlineNote = () => {
    if (noteDraftTitle.trim() || noteDraftBody.trim() || noteDraftImageDataUrl) {
      handleSavePlannerNote();
    } else {
      resetNoteDraft();
    }
    setIsInlineNoteOpen(false);
  };

  const handleEditPlannerNote = (note: PlannerQuickNote) => {
    setEditingPlannerNoteId(note.id);
    setNoteDraftTitle(note.title);
    setNoteDraftBody(note.body);
    setNoteDraftImageDataUrl(note.imageDataUrl ?? undefined);
    setNoteDraftError('');
    setIsNoteModalOpen(true);
  };

  const handleDeletePlannerNote = async (noteId: string) => {
    try {
      await deleteEventNote(selectedEventId, noteId);
      setPlannerNotes((previousNotes) => previousNotes.filter((note) => note.id !== noteId));
      if (editingPlannerNoteId === noteId) resetNoteDraft();
    } catch (error) {
      console.error('Failed to delete planner note:', error);
    }
  };

  const handleNoteDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setTimeout(() => setDraggedNoteId(id), 0);
  };
  const handleNoteDragEnd = () => setDraggedNoteId(null);
  const handleNoteDrop = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData('text/plain');
    if (!droppedId || droppedId === targetId) return;
    const draggedIdx = plannerNotes.findIndex((n) => n.id === droppedId);
    const targetIdx = plannerNotes.findIndex((n) => n.id === targetId);
    const newNotes = [...plannerNotes];
    const [draggedNote] = newNotes.splice(draggedIdx, 1);
    newNotes.splice(targetIdx, 0, draggedNote);
    setPlannerNotes(newNotes);
    setDraggedNoteId(null);
  };

  return {
    plannerNotes,
    setPlannerNotes,
    noteDraftTitle,
    setNoteDraftTitle,
    noteDraftBody,
    setNoteDraftBody,
    noteDraftImageDataUrl,
    setNoteDraftImageDataUrl,
    noteDraftImageFile,
    setNoteDraftImageFile,
    noteDraftError,
    setNoteDraftError,
    editingPlannerNoteId,
    isNoteModalOpen,
    setIsNoteModalOpen,
    isInlineNoteOpen,
    setIsInlineNoteOpen,
    draggedNoteId,
    setDraggedNoteId,
    resetNoteDraft,
    closePlannerNoteModal,
    handlePlannerNoteImageChange,
    handleSavePlannerNote,
    handleCloseInlineNote,
    handleEditPlannerNote,
    handleDeletePlannerNote,
    handleNoteDragStart,
    handleNoteDragEnd,
    handleNoteDrop,
  };
}
