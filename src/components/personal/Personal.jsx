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
    todayDate: '',
    currentTime: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llamada para obtener la hora de Guatemala desde la API
  const fetchGuatemalaTime = async () => {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/America/Guatemala');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const currentDateTime = new Date(data.datetime);
      
      setFormState({
        todayDate: currentDateTime.toISOString().split('T')[0],
        currentTime: currentDateTime.toTimeString().split(' ')[0]
      });
    } catch (error) {
      console.error("Error fetching Guatemala time:", error);
      // Maneja el error visualmente en la interfaz de usuario
      alert("No se pudo obtener la hora de Guatemala. Intenta nuevamente más tarde.");
    }
  };
  

  useEffect(() => {
    fetchGuatemalaTime();  // Llamada inicial para obtener la hora
    const interval = setInterval(fetchGuatemalaTime, 1000);  // Actualiza cada segundo la hora

    return () => clearInterval(interval);  // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleAttendance = async () => {
    const todayDate = formState.todayDate;
    const currentTime = formState.currentTime;
    const status = currentTime && new Date(currentTime).getHours() < 8 ? "A tiempo" : "Tarde"; // Usar la hora de la API

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData && ipData.ip ? ipData.ip : 'IP no disponible';

      const record = {
        user: userName,
        date: todayDate,
        time: currentTime,
        status,
        ip: userIp,
        reason: reason
      };

      console.log(record);

      const response = await reportarEntrada(record);

      if (response && response.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + response.error.message || response.error);
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

  const usuarioLogueado = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  
  // Usar la hora de la API (de formState) en lugar de la hora local
  const currentHour = formState.currentTime ? new Date(`1970-01-01T${formState.currentTime}Z`).getHours() : new Date().getHours(); 

  const isOnTime = currentHour < 8 ? "A tiempo" : "Tarde";
  const imageToShow = currentHour < 8 ? earlyImage : lateImage;
  const backgroundColor = currentHour < 8 ? '#359100' : '#8b0000';
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

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

  return (
    <div className="personal">
      <Navbar user={usuarioLogueado} />
      <Header />
      <div className="posts-personal">
        {usuarioLogueado ? (
          <div className="e-card playing">
            <div className="image"></div>
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
            <button onClick={handleShowPopup}>
              <span>Enviar</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 74 74" height="34" width="34">
                <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                <path fill="black" d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"></path>
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
