import { useState, useEffect } from 'react';
import { getForums } from '../../services/api';

export const useGetForums = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForums = async () => {
            setLoading(true);
            try{
                const result = await getForums();
                //console.log(result)

                if(Array.isArray(result)) {
                    setForums(result);
                }else{
                    setError('Unexpected response structure');
                }
            } catch (err) {
                setError('Failed to fetch forums');
            } finally {
                setLoading(false);
            }
        };

        fetchForums();
    }, []);

    console.log(forums)

    return{ forums, loading, error };
};
