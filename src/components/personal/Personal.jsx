import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { useNavigate } from "react-router-dom";
import { reportarEntrada } from '../../services/api.jsx';
import './personal.css';
import { Header } from '../header/Header.jsx';
import defaultAvatar from '../../assets/img/palmamorro.jpg';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";
  const currentHour = new Date().getHours();
  const waveColors = currentHour < 4 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Verifica si ya se registró asistencia para hoy
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
    const today = new Date().toISOString().split('T')[0];
    setIsButtonDisabled(lastAttendanceDate === today);
  }, []);

  const handleAttendance = async () => {
    try {
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        reason,
      };

      const updatedRecords = [...attendanceRecords, record];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
      localStorage.setItem('lastAttendanceDate', formState.todayDate);
      setIsButtonDisabled(true);
      alert("Asistencia registrada correctamente");
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia: " + error.message);
    } finally {
      setShowPopup(false);
      setReason("");
    }
  };

  const isTimeInRange = () => {
    const currentHour = parseInt(formState.currentTime.split(':')[0], 10);
    return currentHour >= 3 && currentHour < 12;
  };

  return (
    <div className="personal">
      <Navbar user={user} />
      <Header currentDate={formState.todayDate} />
      <div className="posts-personal">
        <div className="e-card">
        <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '210px' }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '420px' }}></div>

          <div className="content-user">
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
          <button
            onClick={() => setShowPopup(true)}
            disabled={isButtonDisabled || !isTimeInRange()}
          >
            Enviar
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
        </div>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>¿Estás seguro de que deseas registrar tu asistencia?</p>
              <textarea
                placeholder="Escribe aquí la razón de tu asistencia"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <button onClick={handleAttendance}>Confirmar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
