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
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
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
