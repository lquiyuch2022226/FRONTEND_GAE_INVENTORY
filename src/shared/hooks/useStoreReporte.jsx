import { useState } from 'react';
import { storeReporteData as storeReporteDataRequest } from '../../services/api';

export const useStoreReporte = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const storeReporteData = async (listado, fecha) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await storeReporteDataRequest({ listado, fecha });
            setIsLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setData(response.data);
            }
        } catch (error) {
            setIsLoading(false);
            setError('Error en la solicitud');
        }
    };

    return {
        storeReporteData,
        isLoading,
        error,
        data
    };
};
