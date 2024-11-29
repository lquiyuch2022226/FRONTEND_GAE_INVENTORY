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
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Controla el estado del botón

  // Verifica si ya se registró asistencia para hoy
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
    const today = new Date().toISOString().split('T')[0];
    setIsButtonDisabled(lastAttendanceDate === today);
  }, []);

  const handleAttendance = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';

      const serverTimeResponse = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      const serverTimeData = await serverTimeResponse.json();
      const serverDateTime = new Date(serverTimeData.utc_datetime);
      const currentHour = serverDateTime.getHours();
      const status = currentHour < 4 ? "A tiempo" : "Tarde";

      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status,
        ip: userIp,
        reason,
      };

      const response = await reportarEntrada(record);
      if (response && response.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + response.error.message || response.error);
      } else {
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
        localStorage.setItem('lastAttendanceDate', formState.todayDate); // Guarda la fecha de registro
        setIsButtonDisabled(true); // Desactiva el botón
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
    setShowPopup(true);
  };

  const handleConfirmAttendance = () => {
    setShowPopup(false);
    handleAttendance();
  };

  const handleCancelAttendance = () => {
    setShowPopup(false);
    setReason("");
  };

  const isTimeInRange = () => {
    const currentHour = parseInt(formState.currentTime.split(':')[0], 10);
    return currentHour >= 3 && currentHour < 12;
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
                  <div className="user-name">{userName}</div>
                  <div className="user-department">{user.account.username}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleShowPopup}
              disabled={isButtonDisabled || !isTimeInRange()} // Verifica si el botón está deshabilitado
              style={{
                cursor: isButtonDisabled || !isTimeInRange() ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled || !isTimeInRange() ? 0.5 : 1,
              }}
            >
              Enviar
            </button>
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <p>¿Estás seguro de que deseas registrar tu asistencia?</p>
                  <textarea
                    placeholder="Escribe aquí la razón de tu asistencia"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '8px',
                    }}
                  />
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
