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

  // Verificar si ya se ha enviado el reporte hoy
  const isAlreadySubmittedToday = () => {
    const lastSubmittedDate = localStorage.getItem(`attendanceSubmittedDate_${userId}`);
    return lastSubmittedDate === formState.todayDate; // Compara la fecha actual con la última fecha enviada
  };

  const handleAttendance = async () => {
    try {
      // Si ya se envió la asistencia hoy, mostrar una alerta
      if (isAlreadySubmittedToday()) {
        alert("Ya has registrado tu asistencia hoy.");
        return;
      }

      // Obtener la IP del usuario
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';

      // Obtener la hora y fecha del servidor con HTTPS
      const serverTimeResponse = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala'); // Usar HTTPS
      const serverTimeData = await serverTimeResponse.json();
      const serverDateTime = new Date(serverTimeData.utc_datetime);

      // Calcular el estado basado en la hora del servidor
      const currentHour = serverDateTime.getHours();
      const status = currentHour < 4 ? "A tiempo" : "Tarde";

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
        
        // Guardar la fecha de envío para evitar envíos posteriores
        localStorage.setItem(`attendanceSubmittedDate_${userId}`, formState.todayDate);

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

  const usuarioLogueado = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const currentHour = new Date().getHours();
  const isOnTime = currentHour < 8 ? "A tiempo" : "Tarde";
  const imageToShow = currentHour < 8 ? earlyImage : lateImage;
  const backgroundColor = currentHour < 8 ? '#359100' : '#8b0000';
  const waveColors = currentHour < 4 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

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

  // Nueva función para validar horario
  const isTimeInRange = () => {
    const currentHour = parseInt(formState.currentTime.split(':')[0], 10);
    return currentHour >= 3 && currentHour < 12; // De 6:00 AM a 12:00 PM
  };

  return (
    <div className="personal">
      <Navbar user={usuarioLogueado} />
      <Header />
      <div className="posts-personal">
        {usuarioLogueado ? (
          <div className="e-card playing">
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '210px' }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '420px' }}></div>
            <div className='content-user'>
              <div className="infotop">
                <img
                  src={usuarioLogueado.profilePicture || defaultAvatar}
                  alt="User Icon"
                  className="icon"
                />
                <div className="user-info text-white">
                  <div className="user-name">{usuarioLogueado.account.name}</div>
                  <div className="user-department">{usuarioLogueado.account.username}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleShowPopup}
              disabled={!isTimeInRange() || isAlreadySubmittedToday()} // Desactiva el botón si ya se ha enviado la asistencia hoy
              style={{
                cursor: isTimeInRange() && !isAlreadySubmittedToday() ? 'pointer' : 'not-allowed',
                opacity: isTimeInRange() && !isAlreadySubmittedToday() ? 1 : 0.5,
              }}
            >
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
                  d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5H49C49.8284 38.5 50.5 37.8284 50.5 37C50.5 36.1716 49.8284 35.5 49 35.5H25Z"
                ></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="user-info">Usuario no registrado</div>
        )}
      </div>
    </div>
  );
};
