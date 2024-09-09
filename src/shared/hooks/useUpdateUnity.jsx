import { useState } from 'react';
import { putUnity as backendUnity } from '../../services/api';

export const useUpdateUnity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const actualizarUnidad = async (id, updateData) => {
        setLoading(true);
        try {
            const response = await backendUnity(id, updateData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {loading, error ,actualizarUnidad};
};
