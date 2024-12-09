import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { Header } from '../header/Header.jsx';
import { Modal } from '../modal/Modal.jsx';
import { reportarEntrada } from '../../services/api.jsx';
import './personal.css';
import defaultAvatar from '../../assets/img/palmamorro.jpg';
import axios from 'axios';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
  });
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Sincronizar hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setFormState({
        todayDate: now.toISOString().split('T')[0],
        currentTime: now.toTimeString().split(' ')[0],
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Verificar si el botón debe estar deshabilitado
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendanceDate_${userId}`);
    const [currentHour] = formState.currentTime.split(':').map(Number);
    const isWithinAllowedTime = currentHour >= 6 && currentHour < 10;
    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime);
  }, [formState.todayDate, formState.currentTime, userId]);

  const getIp = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error("Error al obtener la IP:", error);
      return "IP no disponible";
    }
  };

  const handleAttendance = async (isLate) => {
    try {
      const ip = await getIp();
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status: isLate ? "tarde" : "presente",
        reason: reason,
        ip: ip,
      };

      const response = await reportarEntrada(record);

      if (response.success) {
        localStorage.setItem(`lastAttendanceDate_${userId}`, formState.todayDate);
        setIsButtonDisabled(true);
        alert("Asistencia registrada correctamente");
      } else {
        alert("Hubo un problema al registrar la asistencia. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia. Por favor, inténtalo más tarde.");
    } finally {
      setShowModal(false);
      setReason("");
    }
  };

  const handleButtonClick = () => {
    const [currentHour, currentMinute] = formState.currentTime.split(':').map(Number);
    if (currentHour >= 8 || (currentHour === 8 && currentMinute > 0)) {
      setShowModal(true); // Tarde
    } else {
      handleAttendance(false); // Temprano
    }
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
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            Enviar
          </button>
        </div>

        {/* Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <div className="modal-content">
            <p>¿Por qué llegaste tarde?</p>
            <textarea
              placeholder="Escribe aquí la razón de tu asistencia"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button onClick={() => handleAttendance(true)}>Confirmar</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
