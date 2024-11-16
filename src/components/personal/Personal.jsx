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
  const [isSalidaButtonDisabled, setIsSalidaButtonDisabled] = useState(true); // Estado para botón de salida
  const [salida, setSalida] = useState(""); // Nuevo estado para la salida

  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendance_${userId}`);
    const currentHour = new Date().getHours();
    const isWithinAllowedTime = currentHour >= 7 && currentHour < 10;
    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime);
  }, [formState.todayDate, userId]);

  useEffect(() => {
    const checkSalidaTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      // Habilita el botón entre las 15:30 y las 6:00 del día siguiente
      const isSalidaTime = (currentHour === 15 && currentMinutes >= 30) || (currentHour >= 16 || currentHour < 6);
      setIsSalidaButtonDisabled(!isSalidaTime);
    };

    checkSalidaTime();

    const interval = setInterval(checkSalidaTime, 60000); // Revisa cada minuto

    return () => clearInterval(interval);
  }, []);

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
        salida, // Incluye el campo salida
        ip: userIp
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

  const handleSalida = () => {
    const currentSalidaTime = new Date().toTimeString().split(' ')[0];
    setSalida(currentSalidaTime); // Guarda la hora de salida
    alert("Hora de salida registrada: " + currentSalidaTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFormState({
        todayDate: new Date().toISOString().split('T')[0],
        currentTime: new Date().toTimeString().split(' ')[0]
      });
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
            <div className="image"></div>

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
              <div className="date-time">
                <div className="card" style={{ background: backgroundColor }}>
                  <div className="card-content">
                    <div className="card-top">
                      <p>{isOnTime}</p>
                    </div>
                    <div className="card-bottom">
                      <p>{formState.todayDate}</p>
                      <p>{formState.currentTime}</p>
                    </div>
                  </div>
                  <div className="card-image">
                    <img
                      src={imageToShow}
                      alt="Status Icon"
                      className="status-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleShowPopup} disabled={isButtonDisabled} className={isButtonDisabled ? "disabled" : ""}>
              <span>Enviar</span>
            </button>

            <button onClick={handleSalida} disabled={isSalidaButtonDisabled} className={`salida-button ${isSalidaButtonDisabled ? "disabled" : ""}`}>
              <span>Salida</span>
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
