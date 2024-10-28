/* import { useState, useEffect } from "react";
import { getUpdatedUnitsToday, getUnits } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchUnityToday = () => {
  const [updatedUnits, setUpdatedUnits] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [missingUnits, setMissingUnits] = useState([]);
  const [missingUnitsLoaded, setMissingUnitsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchUpdatedUnitsToday = async () => {
    try {
      const response = await getUpdatedUnitsToday();
      if (response.data.units && Array.isArray(response.data.units)) {
        setUpdatedUnits(response.data.units);
      } else {
        setUpdatedUnits([]);
        setError('No se encontraron unidades actualizadas hoy');
        toast.error('No se encontraron unidades actualizadas hoy');
      }
    } catch (err) {
      setError('Error al cargar unidades actualizadas hoy');
      toast.error('Error al cargar unidades actualizadas hoy');
    }
  };

  const fetchAllUnits = async () => {
    try {
      const response = await getUnits();
      if (response.units && Array.isArray(response.units)) {
        setAllUnits(response.units);
      } else {
        setAllUnits([]);
        setError('No se encontraron unidades');
        toast.error('No se encontraron unidades');
      }
    } catch (err) {
      setError('Error al cargar todas las unidades');
      toast.error('Error al cargar todas las unidades');
    }
  };

  useEffect(() => {
    fetchUpdatedUnitsToday();
    fetchAllUnits();
  }, []);

  useEffect(() => {
    if (allUnits.length > 0 && updatedUnits.length > 0) {
      const updatedUnitIds = new Set(updatedUnits.map(unit => String(unit._id)));
      const missing = allUnits.filter(unit => !updatedUnitIds.has(String(unit._id)));
      setMissingUnits(Array.from(missing));
      setMissingUnitsLoaded(true);
    }
  }, [allUnits, updatedUnits]);

  useEffect(() => {
  }, [missingUnits]);

  return {
    updatedUnits,
    allUnits,
    missingUnits,
    missingUnitsLoaded,
    error,
    reportCount: updatedUnits.length,
  };
};
 */