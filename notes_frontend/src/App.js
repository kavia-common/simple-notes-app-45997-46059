import React, { useMemo, useRef, useState } from 'react';
import './App.css';
import './styles/theme.css';
import './styles/app.css';
import Navbar from './components/Navbar';
import TagFilter from './components/TagFilter';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import EmptyState from './components/EmptyState';
import { useNotes } from './hooks/useNotes';

// PUBLIC_INTERFACE
function App() {
  /** Root single-page Notes app using LocalStorage persistence. */
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    clearAll,
    uniqueTags,
  } = useNotes('notes_v1');

  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [isGrid, setIsGrid] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sort, setSort] = useState('updatedAtDesc');
  const fabRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byText = (n) =>
      !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const byTags = (n) =>
      activeTags.length === 0 || activeTags.every((t) => n.tags.includes(t));
    let out = notes.filter((n) => byText(n) && byTags(n));
    // pinned first
    out = out.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === 'updatedAtDesc') return b.updatedAt - a.updatedAt;
      if (sort === 'createdAtDesc') return b.createdAt - a.createdAt;
      if (sort === 'titleAsc') return a.title.localeCompare(b.title);
      return 0;
    });
    return out;
  }, [notes, query, activeTags, sort]);

  const onCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (note) => {
    setEditing(note);
    setModalOpen(true);
  };

  const onSubmitModal = (payload) => {
    if (editing) {
      updateNote(editing.id, payload);
    } else {
      addNote(payload);
    }
    setModalOpen(false);
    setEditing(null);
    // restore focus to the triggering element (FAB) for accessibility
    setTimeout(() => {
      fabRef.current?.focus();
    }, 0);
  };

  const onCancelModal = () => {
    setModalOpen(false);
    setEditing(null);
    setTimeout(() => {
      fabRef.current?.focus();
    }, 0);
  };

  return (
    <div className="notes-app">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        isGrid={isGrid}
        onToggleLayout={() => setIsGrid((v) => !v)}
        sort={sort}
        onSortChange={setSort}
        onClearAll={clearAll}
      />
      <div className="layout">
        <aside className="sidebar" aria-label="Tag filters">
          <TagFilter
            tags={uniqueTags}
            active={activeTags}
            onChange={setActiveTags}
          />
        </aside>
        <main className="content" aria-live="polite">
          {filtered.length === 0 ? (
            <EmptyState onCreate={onCreate} />
          ) : (
            <div className={isGrid ? 'notes-grid' : 'notes-list'}>
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => onEdit(note)}
                  onDelete={() => deleteNote(note.id)}
                  onTogglePin={() => togglePin(note.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <button
        ref={fabRef}
        className="fab"
        onClick={onCreate}
        aria-label="Create a new note"
        title="New note"
      >
        +
      </button>

      <NoteModal
        open={modalOpen}
        initial={editing}
        onCancel={onCancelModal}
        onSubmit={onSubmitModal}
      />
    </div>
  );
}

export default App;
