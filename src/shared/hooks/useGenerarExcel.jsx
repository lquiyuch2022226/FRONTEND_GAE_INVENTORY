import { useState } from 'react';
import { generarExcel } from '../../services/api';

export const useGenerarExcel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  

  const generateExcelForSelected = async (listado) => {
    setIsGenerating(true);
    setError(null);
    setSuccessMessage('');

    try {
      const result = await generarExcel(listado);

      if (result.error) {
        setError(result.message);
      } else {
        setSuccessMessage('El archivo de Excel se generó correctamente.');
      }
    } catch (e) {
      setError('Hubo un error al generar el archivo de Excel.');
      console.log(e)
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExcelForSelected,
    isGenerating,
    error,
    successMessage,
  };
};
