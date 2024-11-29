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
