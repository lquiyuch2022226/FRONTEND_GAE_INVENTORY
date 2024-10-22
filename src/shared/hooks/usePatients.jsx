import { useEffect, useState } from 'react';
import { getPatients } from '../../services/api';

export const usePatients = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchPatients = async () => {
            try {

                const response = await getPatients();
                setPatients(response.data.users);
            } catch (err) {

                setError(err);
            } finally {

                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return { patients, loading, error };
};
