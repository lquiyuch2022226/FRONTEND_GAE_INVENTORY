import { useState, useEffect } from "react";
import { getPersonalById as getPersonalRequest } from "../../services/api";
import toast from "react-hot-toast";
import { useUserDetails } from "../../shared/hooks/useUserDetails";

export const useFetchPersonal = () => {
  const [personales, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { unidadId } = useUserDetails();

  const getPersonales = async () => {
    setIsLoading(true);
    
    const response = await getPersonalRequest(unidadId);

    setIsLoading(false);
    if (response.error) {
      setError(response.e);
      return toast.error(
        response.e?.response?.data || 'Error al cargar el personal'
      );
    }

    setPersonal(response.data);
  };

  useEffect(() => {
    getPersonales();
  }, []);

  return {
    personales,
    isLoading,
    error
  };
};