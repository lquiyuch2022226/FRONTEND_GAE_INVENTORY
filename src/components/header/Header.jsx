import React, { useState, useEffect } from 'react';
import { Input } from "../Input"; // Asegúrate de que la ruta de Input sea correcta
import './header.css';

export const Header = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
      const formattedDate = now.toLocaleDateString('es-ES');
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
      setIsLate(hours >= 8); // Determina si está tarde
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto
    return () => clearInterval(interval); // Limpia el intervalo cuando se desmonta el componente
  }, []);

  return (
    <div className="header">
      <div className="header-item">
        <span className="header-label">Fecha</span>
        <div className="header-value">{currentDate}</div>
      </div>
      <div className="header-item">
        <span className="header-label">Hora</span>
        <div className="header-value">{currentTime}</div>
      </div>
      <div className="header-item">
        <span className="header-label">Pendejoo</span>
        <div className={`status-icon ${isLate ? 'late' : 'on-time'}`}>
          {isLate ? '✘' : '✔'}
        </div>
      </div>
    </div>
  );
};
