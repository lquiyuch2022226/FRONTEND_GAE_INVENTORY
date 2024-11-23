import React, { useState, useEffect } from 'react';
import { Input } from '../Input'; // Asegúrate de importar el componente Input
import './header.css';

export const Header = () => {
  const [formState, setFormState] = useState({
    todayDate: '',
    currentTime: '',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
      const formattedDate = now.toLocaleDateString('es-ES');
      
      setFormState({
        todayDate: formattedDate,
        currentTime: formattedTime,
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const handleInputValueChange = (value, field) => {
    // En este caso, no es necesario manejar cambios porque los campos son solo de lectura
  };

  return (
    <div className="header-container">
      <div className="input-group">
        <Input
          field="fecha"
          label="Fecha"
          value={formState.todayDate}
          onChangeHandler={handleInputValueChange}
          type="text"
          disabled={true}
        />
        <Input
          field="hora"
          label="Hora"
          value={formState.currentTime}
          onChangeHandler={handleInputValueChange}
          type="text"
          disabled={true}
        />
      </div>
    </div>
  );
};
