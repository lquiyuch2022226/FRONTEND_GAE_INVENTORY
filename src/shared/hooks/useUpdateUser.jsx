import { useState } from 'react';
import { updateUser as backendUser } from '../../services/api';

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const actualizarReporte = async (id, updateData) => {
        setLoading(true);
        try {
            const response = await backendUser(id, updateData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {loading, error, useUpdateUser, actualizarReporte};
};
