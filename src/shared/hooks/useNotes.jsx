import { useEffect, useState } from 'react';
import { getAllNotes } from '../../services/api';

export const useNotes = () => {

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchNotes = async () => {
            try {

                const response = await getAllNotes();
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
