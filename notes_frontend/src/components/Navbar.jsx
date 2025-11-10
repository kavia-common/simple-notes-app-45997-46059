import React from 'react';

/**
 * Top navigation bar with app title, search input, sort select, layout toggle, and clear-all.
 * Ocean Professional styling via CSS classes.
 */
// PUBLIC_INTERFACE
function Navbar({ query, onQueryChange, isGrid, onToggleLayout, sort, onSortChange, onClearAll }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Top navigation">
      <div className="navbar-left">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">🗒️</span>
          <span className="brand-title">Simple Notes</span>
        </div>
        <div className="search">
          <label htmlFor="search-input" className="sr-only">Search notes</label>
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes by title or content"
          />
        </div>
      </div>
      <div className="navbar-right">
        <div className="control">
          <label htmlFor="sort" className="sr-only">Sort notes</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort notes"
          >
            <option value="updatedAtDesc">Recent updates</option>
            <option value="createdAtDesc">Recently created</option>
            <option value="titleAsc">Title (A–Z)</option>
          </select>
        </div>
        <button
          className="btn-secondary"
          onClick={onToggleLayout}
          aria-pressed={isGrid ? 'true' : 'false'}
          aria-label={isGrid ? 'Switch to list view' : 'Switch to grid view'}
          title={isGrid ? 'Grid view' : 'List view'}
        >
          {isGrid ? 'Grid' : 'List'}
        </button>
        <button
          className="btn-danger subtle"
          onClick={onClearAll}
          title="Clear all notes"
          aria-label="Clear all notes"
        >
          Clear
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
