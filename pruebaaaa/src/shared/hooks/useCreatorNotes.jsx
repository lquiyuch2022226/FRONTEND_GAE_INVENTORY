import { useEffect, useState } from 'react';
import { getNotesByCreator } from '../services/noteService';

export const useCreatorNotes = () => {

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchNotes = async () => {

            try {

                const response = await getNotesByCreator();
                setNotes(response.data);
            } catch (err) {

                setError(err);
            } finally {

                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return { notes, loading, error };
};
