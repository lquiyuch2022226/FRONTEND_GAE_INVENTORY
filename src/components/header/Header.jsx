import React, { useState, useEffect } from "react";

const Header = () => {
  const [todayDate, setTodayDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Obtener la fecha actual
  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toLocaleDateString());

    const updateTime = () => {
      const time = new Date();
      setCurrentTime(time.toLocaleTimeString());
    };

    // Actualizar la hora cada segundo
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  return (
    <div className="header-container">
      <div className="input-group">
        <div className="input-wrapper">
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            type="text"
            value={todayDate}
            readOnly
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="hora">Hora</label>
          <input
            id="hora"
            type="text"
            value={currentTime}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
