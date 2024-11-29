import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { useNavigate } from "react-router-dom";
import { reportarEntrada } from '../../services/api.jsx';
import * as XLSX from 'xlsx';
import './personal.css';
import { Header } from '../header/Header.jsx';
import defaultAvatar from '../../assets/img/palmamorro.jpg';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0]
  });

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAttendance = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData?.ip || 'IP no disponible';

      const currentHour = new Date().getHours();
      const status = currentHour < 8 ? "A tiempo" : "Tarde";

      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status,
        ip: userIp,
        reason: currentHour >= 8 ? reason.trim() : "",
      };

      const response = await reportarEntrada(record);

      if (response?.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + (response.error.message || response.error));
      } else {
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
        localStorage.setItem(`hasReportedToday_${userId}`, true); // Marcar como enviado hoy
        alert("Asistencia registrada correctamente");
        setIsSubmitting(true); // Desactiva el botón
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia: " + error.message);
    }
  };

  const handleSubmit = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 8 && !reason.trim()) {
      alert("Por favor, ingresa una razón si llegaste tarde.");
      return;
    }
    handleAttendance();
  };

  useEffect(() => {
    fetchInternetTime();

    const savedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
    const todayDate = new Date().toISOString().split('T')[0];
    const hasReportedToday = savedRecords.some(record => record.date === todayDate);

    if (hasReportedToday) {
      setIsSubmitting(true); // Desactiva el botón
    }

    const interval = setInterval(() => {
      setFormState((prevState) => ({
        ...prevState,
        currentTime: new Date().toTimeString().split(' ')[0]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = new Date().getHours();
  const isLate = currentHour >= 8;
  const isButtonEnabled = currentHour >= 6 && currentHour < 12 && !isSubmitting;

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
                  <div className="user-name">{userName}</div>
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={!isButtonEnabled}>
              Enviar
            </button>
            {isLate && (
              <textarea
                placeholder="Escribe aquí la razón de tu asistencia"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                style={{ width: '100%', marginTop: '10px', padding: '8px' }}
              />
            )}
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
