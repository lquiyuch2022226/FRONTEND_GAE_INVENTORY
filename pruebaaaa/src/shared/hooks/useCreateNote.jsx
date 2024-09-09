import { useState } from 'react';
import { createNote as createNoteAPI } from '../services/noteService';
import { useNavigate } from 'react-router-dom';

export const useCreateNote = () => {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createNote = async (noteData) => {

    setIsLoading(true);
    
    try {

      await createNoteAPI(noteData);
      setIsLoading(false);
      navigate('/note-creator');
    } catch (error) {

      setIsLoading(false);
      console.error('Note creation failed:', error);
    }
  };

  return { createNote, isLoading };
};
