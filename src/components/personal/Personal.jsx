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

  // Verificar si ya se registró la asistencia hoy y habilitar solo entre 7 a.m. y 10 a.m.
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendance_${userId}`);
    const currentHour = new Date().getHours();

    // Permitir registrar asistencia solo entre las 7 y las 10 a.m. si no se ha registrado ya hoy
    const isWithinAllowedTime = currentHour >= 19 && currentHour < 20;
    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime);
  }, [formState.todayDate, userId]);

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

        // Guardar la fecha de la asistencia registrada en localStorage
        localStorage.setItem(`lastAttendance_${userId}`, todayDate);

        // Deshabilitar el botón
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

  const fetchInternetTime = async () => {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/America/Guatemala');
      const data = await response.json();
      const currentDateTime = new Date(data.datetime);

      setFormState({
        todayDate: currentDateTime.toISOString().split('T')[0],
        currentTime: currentDateTime.toTimeString().split(' ')[0]
      });
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
      <Navbar user={user} />

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
              <button onClick={handleShowPopup} disabled={isButtonDisabled}>
                <span>Enviar</span>
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
                    />
                    <div className="popup-actions">
                      <button onClick={handleConfirmAttendance}>Sí</button>
                      <button onClick={handleCancelAttendance}>No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
