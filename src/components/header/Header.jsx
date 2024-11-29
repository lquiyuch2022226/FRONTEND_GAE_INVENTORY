import React, { useState, useEffect } from 'react';
import { Input } from '../Input';
import './header.css';

export const Header = () => {
  const [formState, setFormState] = useState({
    todayDate: 'Cargando...',
    currentTime: 'Cargando...',
  });
  const [isLate, setIsLate] = useState(false);

  const fetchInternetTime = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      if (!response.ok) throw new Error('Error al obtener los datos de la API');
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

      setIsLate(hours >= 8);
    } catch (error) {
      console.error('Error fetching internet time:', error);
    }
  };

  useEffect(() => {
    fetchInternetTime();
  }, []);

  return (
    <div className="header-container">
      <div className="input-group">
        <Input
          field="fecha"
          label="Fecha"
          value={formState.todayDate}
          type="text"
          disabled
        />
        <Input
          field="hora"
          label="Hora"
          value={formState.currentTime}
          type="text"
          disabled
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
