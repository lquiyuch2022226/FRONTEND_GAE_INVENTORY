// CreateNote.jsx
import React, { useState } from 'react';
import { useCreateNote } from '../hooks/useCreateNote';
import './createNote.css';

export const CreateNote = () => {

    const { createNote, isLoading } = useCreateNote();
    const [formState, setFormState] = useState({
        title: { value: '', isValid: false, showError: false },
        notedUsername: { value: '', isValid: false, showError: false },
        body: { value: '', isValid: false, showError: false },
    });

    const handleInputChange = (value, field) => {

        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                value,
            },
        }));
    };

    const handleValidationOnBlur = (value, field) => {

        const isValid = value.trim() !== '';
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                isValid,
                showError: !isValid,
            },
        }));
    };

    const handleCreateNote = (event) => {

        event.preventDefault();
        const noteData = {
            title: formState.title.value,
            notedUsername: formState.notedUsername.value,
            body: formState.body.value,
        };

        createNote(noteData);
    };

    const isSubmitDisabled = isLoading || !Object.values(formState).every((field) => field.isValid);

    return (
        <div className="create-note-container">
            <h1>Crear Nota</h1>
            <form className="create-note-form" onSubmit={handleCreateNote}>
                <input
                    type="text"
                    placeholder="Título"
                    value={formState.title.value}
                    onChange={(e) => handleInputChange(e.target.value, 'title')}
                    onBlur={(e) => handleValidationOnBlur(e.target.value, 'title')}
                />
                {formState.title.showError && <span>El título es necesario.</span>}
                <input
                    type="text"
                    placeholder="Nombre de usuario destinatario"
                    value={formState.notedUsername.value}
                    onChange={(e) => handleInputChange(e.target.value, 'notedUsername')}
                    onBlur={(e) => handleValidationOnBlur(e.target.value, 'notedUsername')}
                />
                {formState.notedUsername.showError && <span>El nombre de usuario es necesario.</span>}
                <textarea
                    placeholder="Cuerpo"
                    value={formState.body.value}
                    onChange={(e) => handleInputChange(e.target.value, 'body')}
                    onBlur={(e) => handleValidationOnBlur(e.target.value, 'body')}
                />
                {formState.body.showError && <span>El cuerpo es necesario.</span>}
                <button type="submit" disabled={isSubmitDisabled}>
                    Crear
                </button>
            </form>
        </div>
    );
};

