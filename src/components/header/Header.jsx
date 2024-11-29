import React, { useState, useEffect } from 'react';
import { Input } from '../Input'; // Asegúrate de importar el componente Input
import './header.css';

export const Header = () => {
  const [formState, setFormState] = useState({
    todayDate: '',
    currentTime: '',
  });
  const [isLate, setIsLate] = useState(false);

  const fetchInternetTime = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      const data = await response.json();
      const currentDateTime = new Date(data.datetime);
      const hours = currentDateTime.getHours();
      const minutes = currentDateTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
      const formattedDate = currentDateTime.toLocaleDateString('es-ES');

      setFormState({
        todayDate: formattedDate,
        currentTime: formattedTime,
      });

      setIsLate(hours >= 8); // Actualiza el estado "A tiempo/Tarde"
    } catch (error) {
      console.error("Error fetching internet time:", error);
    }
  };

  useEffect(() => {
    fetchInternetTime();
    const interval = setInterval(fetchInternetTime, 60000); // Actualiza cada minuto desde la API
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
      <div className="status-container">
        <span className="status-label">Estado</span>
        <div className={`status-icon ${isLate ? 'late' : 'on-time'}`}>
          {isLate ? '✘' : '✔'}
        </div>
      </div>
    </div>
  );
};
