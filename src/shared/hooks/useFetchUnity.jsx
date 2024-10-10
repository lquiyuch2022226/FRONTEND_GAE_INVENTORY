// useFetchUnity.js
import { useState, useEffect } from "react";
import { getUnityById as getUnityByIdRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchUnity = (unityId) => {
  const [assistance, setAssistance] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnity = async () => {
    try {
      const response = await getUnityByIdRequest(unityId);
      if (response.data?.unity) {
        setFecha(response.data.unity.dateOfReportByUnity);
        setAssistance(response.data);
      } else {
        setError('Unidad no encontrada');
        toast.error('Error al cargar la unidad');
      }
    } catch (err) {
      setError('Error al cargar la unidad');
      toast.error('Error al cargar la unidad');
    }
  };

  useEffect(() => {
    if (unityId) {
      setIsLoading(true);
      fetchUnity();
    }
  }, [unityId]);

  useEffect(() => {
    if (!error) {
      setIsLoading(false); // Stop loading if no error
    }
  }, [assistance, error]);

  return {
    assistance,
    fecha,
    isLoading,
    error
  };
};
