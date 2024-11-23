import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { reportarEntrada } from '../../services/api.jsx';
import { Header } from "../header/Header.jsx"; // Importamos el Header
import './personal.css';
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

  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [exitTime, setExitTime] = useState(null); // Nueva variable para la hora de salida

  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendance_${userId}`);
    const currentHour = new Date().getHours();
    const isWithinAllowedTime = currentHour >= 20 && currentHour < 22;
    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime);
  }, [formState.todayDate, userId]);

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
    setAttendanceRecords(storedRecords);
  }, [userId]);

  const handleAttendance = async () => {
    const todayDate = formState.todayDate;
    const currentTime = formState.currentTime;
    const status = new Date().getHours() < 8 ? "A tiempo" : "Tarde";

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';

      const record = {
        user: userName,
        date: todayDate,
        time: currentTime,
        status,
        reason: reason,
        ip: userIp        
      };

      const response = await reportarEntrada(record);

      if (response && response.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + response.error.message || response.error);
      } else {
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));

        localStorage.setItem(`lastAttendance_${userId}`, todayDate);
        setIsButtonDisabled(true);
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

  const handleMarkExit = () => {
    const exitTime = new Date().toTimeString().split(' ')[0]; // Obtener la hora actual de salida

    // Buscar el registro de asistencia de hoy para este usuario
    const updatedRecords = attendanceRecords.map(record => {
      if (record.date === formState.todayDate && !record.exitTime) {
        return { ...record, exitTime }; // Agregar la hora de salida al registro
      }
      return record;
    });

    // Actualizar el estado y guardar en localStorage
    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));

    alert("Hora de salida registrada correctamente");
  };

  // Definir la función handleShowPopup
  const handleShowPopup = () => {
    setShowPopup(true); // Muestra el popup si es necesario
  };

  return (
    <div className="personal">
      <Navbar user={user} />
      <Header />
      <div className="posts-personal">
        {user ? (
          <div className="e-card playing">
            <div className="image"></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, #030e2e, #023a0e, #05a00d)` }}></div>
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
            <button onClick={handleShowPopup} disabled={isButtonDisabled}>
              <span>Enviar</span>
            </button>
            <button 
              onClick={handleMarkExit} 
              disabled={!attendanceRecords.some(record => record.date === formState.todayDate && !record.exitTime)}>
              Marcar Salida
            </button>

            <div className="attendance-records">
              {attendanceRecords.map((record, index) => (
                <div key={index} className="attendance-record">
                  <div>Fecha: {record.date}</div>
                  <div>Hora de Entrada: {record.time}</div>
                  {record.exitTime ? (
                    <div>Hora de Salida: {record.exitTime}</div>
                  ) : (
                    <div>Esperando Hora de Salida...</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Usuario no autenticado</p>
        )}
      </div>
    </div>
  );
};
