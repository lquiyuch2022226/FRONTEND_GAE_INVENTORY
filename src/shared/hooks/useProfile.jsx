import { useState, useCallback } from 'react';
import { getUserProfile } from '../../services/api';

export const useProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = useCallback(async () => {

        try {
            const userData = await getUserProfile();

            setUser(userData);
            setLoading(false);
        } catch (e) {

            setError(e.message);
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        fetchUserProfile
    };
};
