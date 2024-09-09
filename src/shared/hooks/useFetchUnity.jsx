import { useState, useEffect } from "react";
import { getUnityById as getUnityByIdRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchUnity = (unityId) => {
  const [assistance, setAssistance] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnity = async () => {
    setIsLoading(true);

    try {
      const response = await getUnityByIdRequest(unityId);
      if (response.data?.unity) {
        setFecha(response.data.unity.dateOfReportByUnity);
        setAssistance(response.data);
        console.log(response.data.unity.dateOfReportByUnity, "unidad encontrada");
      } else {
        setError('Unidad no encontrada');
        toast.error('Error al cargar la unidad');
      }
    } catch (err) {
      setError('Error al cargar la unidad');
      toast.error('Error al cargar la unidad');
    }

    setIsLoading(false);
  };

  // useEffect para ejecutar fetchUnity cuando cambie unityId
  useEffect(() => {
    if (unityId) {
      fetchUnity();
    }
  }, [unityId]);

  // useEffect para registrar el mensaje solo cuando se carga la data
  useEffect(() => {
    if (!isLoading && assistance) {
      console.log(assistance.unity.dateOfReportByUnity, "fecha encontrada");
    }
  }, [isLoading, assistance]);

  return {
    assistance,
    fecha,
    isLoading,
    error
  };
};
