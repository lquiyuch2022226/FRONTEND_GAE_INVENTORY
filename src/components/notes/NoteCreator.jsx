// NoteCreator.jsx
import React from 'react';
import { useCreatorNotes } from '../hooks/useCreatorNotes';
import { useNavigate } from 'react-router-dom';
import './notes.css';

const NoteCreator = () => {
  
  const { notes, loading, error } = useCreatorNotes();
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/create-note');
  };

  return (
    <div className="note-creator">
      <div className="header">
        <h1>Tus Notas</h1>
        <button onClick={handleCreateNote}>Crear Nota</button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error al cargar las notas.</p>}
      {!loading && !error && (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
              <small>Dirigido a: {note.notedUserId.name}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoteCreator;
