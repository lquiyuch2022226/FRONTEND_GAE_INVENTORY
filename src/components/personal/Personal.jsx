import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { reportarEntrada } from '../../services/api.jsx';
import { Header } from "../header/Header.jsx";
import './personal.css';
import defaultAvatar from '../../assets/img/palmamorro.jpg';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
  });

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isExitButtonDisabled, setIsExitButtonDisabled] = useState(true);

  // Cargar registros desde localStorage
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
    setAttendanceRecords(storedRecords);
  }, [userId]);

  // Actualizar fecha y hora actuales cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setFormState({
        todayDate: now.toISOString().split('T')[0],
        currentTime: now.toTimeString().split(' ')[0],
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Verificar disponibilidad de los botones según la hora
  useEffect(() => {
    const currentDate = new Date();
    const currentTimeInMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

    const isWithinSendTime = currentTimeInMinutes >= 7 * 60 && currentTimeInMinutes <= 10 * 60;
    const hasRecordWithoutExit = attendanceRecords.some(record => record.date === formState.todayDate && !record.exitTime);
    const isWithinExitTime = currentTimeInMinutes >= 15 * 60 + 30 && currentTimeInMinutes <= 20 * 60;

    setIsSendButtonDisabled(!isWithinSendTime);
    setIsExitButtonDisabled(!(isWithinExitTime && hasRecordWithoutExit));
  }, [attendanceRecords, formState.todayDate]);

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
        reason: status === "Tarde" ? reason : "",
        ip: userIp,
      };

      const updatedRecords = [...attendanceRecords, record];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
      alert("Asistencia registrada correctamente");
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert("Hubo un error al registrar la asistencia");
    } finally {
      setShowPopup(false);
      setReason("");
    }
  };

  const handleMarkExit = () => {
    const exitTime = new Date().toTimeString().split(' ')[0];

    const updatedRecords = attendanceRecords.map(record =>
      record.date === formState.todayDate && !record.exitTime
        ? { ...record, exitTime }
        : record
    );

    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
    alert("Hora de salida registrada correctamente");
  };

  return (
    <div className="personal">
      <Navbar user={user} />
      <Header />
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
            </div>
            <button onClick={() => setShowPopup(true)} disabled={isSendButtonDisabled}>
              Enviar Entrada
            </button>
            <button onClick={handleMarkExit} disabled={isExitButtonDisabled}>
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
