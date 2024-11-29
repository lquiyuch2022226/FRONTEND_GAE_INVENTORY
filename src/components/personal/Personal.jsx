import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { useNavigate } from "react-router-dom";
import { reportarEntrada } from '../../services/api.jsx';
import * as XLSX from 'xlsx';
import './personal.css';
import { Header } from '../header/Header.jsx';
import defaultAvatar from '../../assets/img/palmamorro.jpg';
import earlyImage from '../../assets/img/comprobado.png';
import lateImage from '../../assets/img/cerca.png';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0]
  });

  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup
  const [reason, setReason] = useState("");
  const [isWithinTimeFrame, setIsWithinTimeFrame] = useState(false); // Estado para el horario permitido

  const fetchInternetTime = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      const data = await response.json();
      const serverDateTime = new Date(data.datetime);

      // Actualizar la fecha y hora
      setFormState((prevState) => ({
        ...prevState,
        todayDate: serverDateTime.toISOString().split('T')[0],
        currentTime: serverDateTime.toTimeString().split(' ')[0],
      }));

      // Validar si está dentro del rango permitido (6:00 am - 12:00 pm)
      const currentHour = serverDateTime.getHours();
      setIsWithinTimeFrame(currentHour >= 6 && currentHour < 12);
    } catch (error) {
      console.error("Error fetching internet time:", error);
    }
  };

  useEffect(() => {
    fetchInternetTime();
    const interval = setInterval(() => {
      setFormState((prevState) => ({
        ...prevState,
        currentTime: new Date().toTimeString().split(' ')[0]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAttendance = async () => {
    try {
      const serverTimeResponse = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      const serverTimeData = await serverTimeResponse.json();
      const serverDateTime = new Date(serverTimeData.utc_datetime);

      const currentHour = serverDateTime.getHours();
      if (currentHour < 6 || currentHour >= 12) {
        alert("Solo se puede registrar asistencia entre las 6:00 am y las 12:00 pm.");
        return;
      }

      const userIpResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await userIpResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';

      const status = currentHour < 8 ? "A tiempo" : "Tarde";
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status,
        ip: userIp,
        reason: currentHour >= 8 ? reason : "",
      };

      console.log(record);

      const response = await reportarEntrada(record);

      if (response && response.error) {
        alert("Error al registrar la asistencia: " + (response.error.message || response.error));
      } else {
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
        alert("Asistencia registrada correctamente");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia: " + error.message);
    } finally {
      setShowPopup(false);
      setReason("");
    }
  };

  const handleShowPopup = () => {
    setShowPopup(true); // Muestra el pop-up
  };

  const handleConfirmAttendance = () => {
    setShowPopup(false);
    handleAttendance(); // Realiza el registro de asistencia
  };

  const handleCancelAttendance = () => {
    setShowPopup(false); // Cierra el pop-up sin hacer nada
    setReason("");
  };

  return (
    <div className="personal">
      <Navbar user={user} />
      <Header />
      <div className="posts-personal">
        {user ? (
          <div className="e-card playing">
            <div className="content-user">
              <div className="infotop">
                <img
                  src={user.profilePicture || defaultAvatar}
                  alt="User Icon"
                  className="icon"
                />
                <div className="user-info text-white">
                  <div className="user-name">{user.account.name}</div>
                  <div className="user-department">{user.account.username}</div>
                </div>
              </div>
            </div>
            <button onClick={handleShowPopup} disabled={!isWithinTimeFrame}>
              <span>Enviar</span>
            </button>

            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <p>¿Estás seguro de que deseas registrar tu asistencia?</p>
                  {formState.currentTime.split(':')[0] >= 8 && (
                    <textarea
                      placeholder="Escribe aquí la razón de tu asistencia"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="4"
                      style={{ width: '100%', marginTop: '10px', padding: '8px' }}
                    />
                  )}
                  <div className="popup-actions">
                    <button onClick={handleConfirmAttendance}>Sí</button>
                    <button onClick={handleCancelAttendance}>No</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
