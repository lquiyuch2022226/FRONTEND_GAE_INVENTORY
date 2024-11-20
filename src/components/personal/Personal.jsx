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

  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llamada para obtener la hora de Guatemala desde la API
  const fetchGuatemalaTime = async () => {
    try {
      // Usando HTTPS para evitar el error de Mixed Content
      const response = await fetch('https://worldtimeapi.org/api/timezone/America/Guatemala');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return new Date(data.datetime);  // Devolvemos el objeto Date
    } catch (error) {
      console.error("Error fetching Guatemala time:", error);
      alert("No se pudo obtener la hora de Guatemala. Intenta nuevamente más tarde.");
      return null;
    }
  };
  

  const handleAttendance = async () => {
    // Obtener la hora de Guatemala en este momento
    const guatemalaTime = await fetchGuatemalaTime();
    if (!guatemalaTime) return;  // Si no pudimos obtener la hora, no procedemos

    const todayDate = guatemalaTime.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
    const currentTime = guatemalaTime.toTimeString().split(' ')[0]; // Hora en formato HH:MM:SS
    const status = new Date(currentTime).getHours() < 8 ? "A tiempo" : "Tarde"; // Usar la hora de la API

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
  
  // Aquí usamos directamente la fecha y hora de Guatemala obtenida desde la API
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
            <div className="wave" style={{ background: `linear-gradient(744deg, #359100, #023a0e, #05a00d)` }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, #359100, #023a0e, #05a00d)`, top: '210px' }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, #359100, #023a0e, #05a00d)`, top: '420px' }}></div>

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
