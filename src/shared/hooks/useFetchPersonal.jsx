/* import { useState, useEffect } from "react";
import { getPersonalById as getPersonalRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchPersonal = () => {
  const [personales, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPersonales = async () => {
    setIsLoading(true);
    
    // Obtener el perfil del usuario del local storage
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const unidadId = userProfile.officeLocation; // Extraer el officeLocation
    console.log(unidadId)

    const response = await getPersonalRequest(unidadId);

    setIsLoading(false);
    if (response.error) {
      console.log("Error fetching personal:", response.e); // Imprimir el error en la consola
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
 */