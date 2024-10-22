import { useEffect, useState } from 'react';
import { getReporteData } from '../../services/api';

export const useGetReport = () => {
    const [reportResponse, setReport] = useState([]);
    const [fechaReport, setFecha] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getReporteData();
                setReport(data);
                if(data.data){
                    setFecha(data.data.createdAt);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    return {
        reportResponse,
        fechaReport,
        loading,
        error
    };
};
