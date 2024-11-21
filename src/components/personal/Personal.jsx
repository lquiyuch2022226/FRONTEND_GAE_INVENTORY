import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { reportarEntrada } from '../../services/api.jsx';
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

  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendance_${userId}`);
    const currentHour = new Date().getHours();
    const isWithinAllowedTime = currentHour >= 7 && currentHour < 10;

    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime);
  }, [formState.todayDate, userId]);

  const handleAttendance = async () => {
    const todayDate = formState.todayDate;
    const currentTime = formState.currentTime;
    const status = new Date().getHours() < 8 ? "A tiempo" : "Tarde";

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData?.ip || 'IP no disponible';

      const record = {
        user: userName,
        date: todayDate,
        time: currentTime,
        status,
        reason: reason,
        ip: userIp
      };

      const response = await reportarEntrada(record);

      if (response?.error) {
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
      alert("Error al registrar la asistencia: " + error.message);
    } finally {
      setShowPopup(false);
      setReason("");
    }
  };

  const currentHour = new Date().getHours();
  const isOnTime = currentHour < 8 ? "A tiempo" : "Tarde";
  const imageToShow = currentHour < 8 ? earlyImage : lateImage;
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

  useEffect(() => {
    const interval = setInterval(() => {
      setFormState({
        todayDate: new Date().toISOString().split('T')[0],
        currentTime: new Date().toTimeString().split(' ')[0]
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShowPopup = () => setShowPopup(true);

  const handleConfirmAttendance = () => handleAttendance();

  const handleCancelAttendance = () => {
    setShowPopup(false);
    setReason("");
  };

  return (
    <div className="personal">
      <Navbar user={user} />
      <div className="posts-personal">
        {user ? (
          <div className="e-card playing">
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
            <div className="content-user">
              <img
                src={user.profilePicture || defaultAvatar}
                alt="User Icon"
                className="icon"
              />
              <div className="infotop">
                <div className="user-name">{userName}</div>
                <div className="user-department">{user.account?.username || "Invitado"}</div>
              </div>
            </div>
            <button onClick={handleShowPopup} disabled={isButtonDisabled}>
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
                    style={{ width: '100%', marginTop: '10px', padding: '8px' }}
                    disabled={isOnTime === "A tiempo"}
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
