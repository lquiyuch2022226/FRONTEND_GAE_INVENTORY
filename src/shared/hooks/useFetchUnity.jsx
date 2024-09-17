import { useState, useEffect } from "react";
import { getAllUnities as getAllUnitiesRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchAllUnities = () => {
  const [unities, setUnities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnities = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUnitiesRequest();
      if (response.data) {
        setUnities(response.data); // Asumimos que el API devuelve un array de unidades
      } else {
        setError("No se encontraron unidades");
        toast.error("Error al cargar las unidades");
      }
    } catch (err) {
      setError("Error al cargar las unidades");
      toast.error("Error al cargar las unidades");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUnities();
  }, []);

  return {
    unities,
    isLoading,
    error,
  };
};
