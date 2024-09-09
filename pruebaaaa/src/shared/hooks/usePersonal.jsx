import { useEffect, useState } from 'react';
import { getgetUserById } from '../../services/api';

export const useUsers = () => {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchUsers = async () => {
            try {

                const response = await getUsers();
                setUsers(response || []);  
            } catch (err) {

                setError(err);
            } finally {

                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};