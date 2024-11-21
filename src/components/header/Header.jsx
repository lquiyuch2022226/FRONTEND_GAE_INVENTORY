import React, { useState, useEffect } from 'react';
import { Input } from "../Input"; // Asegúrate de que la ruta de Input sea correcta
import "./header.css"
export const Header = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isOnTime, setIsOnTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
      const formattedDate = now.toLocaleDateString('es-ES');
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
      setIsOnTime(hours < 8 ? "A tiempo" : "Tarde");
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto
    return () => clearInterval(interval); // Limpia el intervalo cuando se desmonta el componente
  }, []);

  return (
    <div className="header">
      <div className="header-content">
        {/* Fecha */}
        <div className="header-item">
          <Input
            field="date"
            label="Fecha"
            value={currentDate}
            onChangeHandler={() => {}}
            type="text"
            disabled={true}
          />
        </div>
        
        {/* Hora */}
        <div className="header-item">
          <Input
            field="time"
            label="Hora"
            value={currentTime}
            onChangeHandler={() => {}}
            type="text"
            disabled={true}
          />
        </div>

        {/* Estado de la asistencia */}
        <div className="header-item">
          <Input
            field="status"
            label="Estado"
            value={isOnTime}
            onChangeHandler={() => {}}
            type="text"
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};
