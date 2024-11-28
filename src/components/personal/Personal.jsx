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

  // Definimos el estado formState
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0]
  });

  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar múltiples envíos
  
  // Verificar si la hora actual está antes o después de las 8:00 AM
  const currentHour = new Date().getHours();
  const isLate = currentHour >= 8;

  useEffect(() => {
    // Función para obtener la hora de servidor y fecha
    const fetchInternetTime = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/America/Guatemala');
        const data = await response.json();
        const currentDateTime = new Date(data.datetime);
        setFormState((prevState) => ({
          ...prevState,
          todayDate: currentDateTime.toISOString().split('T')[0],
          currentTime: currentDateTime.toTimeString().split(' ')[0],
        }));
      } catch (error) {
        console.error("Error fetching internet time:", error);
      }
    };

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
      // Obtener la IP del usuario
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';
  
      // Obtener la hora y fecha del servidor con HTTPS
      const serverTimeResponse = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      const serverTimeData = await serverTimeResponse.json();
      const serverDateTime = new Date(serverTimeData.utc_datetime);
  
      // Calcular el estado basado en la hora del servidor
      const currentHour = serverDateTime.getHours();
      const status = currentHour < 8 ? "A tiempo" : "Tarde";
  
      // Crear el objeto de registro
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status,
        ip: userIp,
        reason: reason
      };
  
      console.log(record);
  
      // Enviar al backend
      const response = await reportarEntrada(record);
  
      if (response && response.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + response.error.message || response.error);
      } else {
        // Actualizar los registros en el frontend (localStorage)
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
  
        // Guardar los registros actualizados en localStorage
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
  
        // Mostrar mensaje de éxito
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
    if (isLate) {
      setShowPopup(true); // Solo muestra el popup si está tarde
    } else {
      handleAttendance(); // Si está a tiempo, registra la asistencia directamente
    }
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
            <div className="image"></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${isLate ? '#8b0000' : '#359100'}, ${isLate ? '#b22222' : '#023a0e'})` }}></div>

            <div className='content-user'>
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
            <button onClick={handleShowPopup}>
              <span>Enviar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 74 74"
                height="34"
                width="34"
              >
                <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                <path
                  fill="black"
                  d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                ></path>
              </svg>
            </button>

            {/* Pop-up para confirmar */}
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <p>¿Estás seguro de que deseas registrar tu asistencia?</p>
                  <textarea
                    placeholder="Escribe aquí la razón de tu asistencia"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    style={{ width: '100%', marginTop: '10px', padding: '8px' }}
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
