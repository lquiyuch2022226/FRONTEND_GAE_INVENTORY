import { useEffect, useState } from 'react';
import { getSupporters } from '../../services/api';

export const useSupporters = () => {

    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchSupporters = async () => {
            try {

                const response = await getSupporters();
                setSupporters(response.data.users);
            } catch (err) {

                setError(err);
            } finally {
                
                setLoading(false);
            }
        };

        fetchSupporters();
    }, []);

    return { supporters, loading, error };
};
