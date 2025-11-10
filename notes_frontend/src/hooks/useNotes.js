import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Note schema:
 * { id (uuid), title, content, tags: string[], createdAt, updatedAt, pinned: boolean, color?: string }
 *
 * Provides:
 * - notes: Note[]
 * - addNote({title, content, tags, pinned, color})
 * - updateNote(id, patch)
 * - deleteNote(id)
 * - togglePin(id)
 * - clearAll()
 * - uniqueTags: string[]
 */
// PUBLIC_INTERFACE
export function useNotes(storageKey = 'notes_v1') {
  const [notes, setNotes, clear] = useLocalStorage(storageKey, []);

  const uuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    // fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const now = () => Date.now();

  const normalize = (n) => ({
    id: n.id ?? uuid(),
    title: (n.title ?? '').toString(),
    content: (n.content ?? '').toString(),
    tags: Array.isArray(n.tags)
      ? n.tags.map((t) => t.toString().trim()).filter(Boolean)
      : [],
    createdAt: n.createdAt ?? now(),
    updatedAt: n.updatedAt ?? now(),
    pinned: !!n.pinned,
    color: n.color || undefined,
  });

  const addNote = useCallback((n) => {
    setNotes((prev) => {
      const newNote = normalize(n);
      newNote.createdAt = now();
      newNote.updatedAt = newNote.createdAt;
      return [newNote, ...prev];
    });
  }, [setNotes]);

  const updateNote = useCallback((id, patch) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? normalize({ ...n, ...patch, updatedAt: now() }) : n))
    );
  }, [setNotes]);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [setNotes]);

  const togglePin = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: now() } : n
      )
    );
  }, [setNotes]);

  const clearAll = useCallback(() => {
    if (window.confirm('Clear all notes? This cannot be undone.')) clear();
  }, [clear]);

  const uniqueTags = useMemo(() => {
    const set = new Set();
    for (const n of notes) {
      for (const t of n.tags || []) set.add(t);
    }
    return Array.from(set);
  }, [notes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    clearAll,
    uniqueTags,
  };
}
