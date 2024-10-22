import React, { useEffect, useState } from 'react';
import { Navbar } from "../../components/Navbar";
import { useNotes } from '../../shared/hooks/useNotes';
import { useUserDetails } from "../../shared/hooks/useUserDetails"
import './notes.css';

export const NoteList = () => {

    const { notes, loading, error } = useNotes();
    const { username } = useUserDetails();

    return (
        <div className="note-list">
            <Navbar user={username} />
            <div className="content">
                <h1>Lista de Notas</h1>
                {loading && <p>Cargando...</p>}
                {error && <p>Error al cargar las notas.</p>}
                {!loading && !error && (
                    <ul>
                        {notes.map((note) => (
                            <li key={note._id}>
                                <h2>{note.title}</h2>
                                <p>{note.body}</p>
                                <small>Creado por: {note.creatorUserId.name}</small>
                                <small> || Acerca de: {note.notedUserId.name}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};