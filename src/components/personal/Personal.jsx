import React, { useState, useEffect } from 'react'; // Importa React y hooks como useState y useEffect
import { Navbar } from '../Navbar.jsx'; // Importa el componente Navbar
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas
import { reportarEntrada } from '../../services/api.jsx'; // Importa la función para reportar la entrada del usuario
import './personal.css'; // Importa los estilos CSS para este componente
import { Header } from '../header/Header.jsx'; // Importa el componente Header
import defaultAvatar from '../../assets/img/palmamorro.jpg'; // Avatar predeterminado si el usuario no tiene uno
import axios from 'axios'; // Importa Axios para hacer peticiones HTTP
import { Modal } from '../modal/Modal.jsx'; // Importa el componente Modal para mostrar el formulario de llegada tarde

export const Personal = () => {
  // Se obtiene el usuario desde localStorage o se usa un valor por defecto
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const userId = user.account?.homeAccountId || "Invitado"; // Obtiene el ID de usuario
  const userName = user.account?.name || "Invitado"; // Obtiene el nombre del usuario
  const currentHour = new Date().getHours(); // Obtiene la hora actual
  // Establece los colores del fondo dependiendo de la hora (antes o después de las 8am)
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

  // Definir el estado de los registros de asistencia y la información del formulario
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0], // Fecha actual
    currentTime: new Date().toTimeString().split(' ')[0], // Hora actual
  });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de llegada tarde
  const [reason, setReason] = useState(""); // Razón de la llegada tarde
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Estado que controla si el botón de asistencia está habilitado

  // Efecto que sincroniza la hora y fecha actuales cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setFormState({
        todayDate: now.toISOString().split('T')[0], // Actualiza la fecha
        currentTime: now.toTimeString().split(' ')[0], // Actualiza la hora
      });
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonta
  }, []);

  // Verifica si el botón debe estar deshabilitado (si ya registró asistencia o si está fuera del rango horario permitido)
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem(`lastAttendanceDate_${userId}`);
    const [currentHour] = formState.currentTime.split(':').map(Number);
    const isWithinAllowedTime = currentHour >= 11 && currentHour < 14; // Asistencia solo entre las 6am y las 10am
    setIsButtonDisabled(lastAttendanceDate === formState.todayDate || !isWithinAllowedTime); // Deshabilita el botón si ya registró o si está fuera del tiempo permitido
  }, [formState.todayDate, formState.currentTime, userId]);

  // Función para obtener la IP pública del usuario
  const getIp = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json'); // Llama a la API para obtener la IP
      return response.data.ip;
    } catch (error) {
      console.error("Error al obtener la IP:", error);
      return "IP no disponible"; // Retorna un mensaje si hay un error al obtener la IP
    }
  };

  // Maneja el registro de asistencia (temprano o tarde)
  const handleAttendance = async (isLate) => {
    try {
      const ip = await getIp(); // Obtiene la IP
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        status: isLate ? "tarde" : "presente", // Establece el estado según si es tarde o temprano
        reason: reason, // Razón en caso de que sea tarde
        ip: ip, // IP obtenida
      };

      console.log("Intentando registrar asistencia:", record);

      const response = await reportarEntrada(record); // Llama a la función para reportar la entrada al servidor
      console.log("Respuesta del API:", response);

      // Verifica si el mensaje de respuesta es exitoso
      if (response.msg === 'Registros de asistencia almacenados correctamente') {
        const updatedRecords = [...attendanceRecords, record]; // Actualiza el estado con el nuevo registro
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords)); // Guarda los registros en localStorage
        localStorage.setItem(`lastAttendanceDate_${userId}`, formState.todayDate); // Guarda la fecha de la última asistencia
        setIsButtonDisabled(true); // Deshabilita el botón después de registrar la asistencia
        alert("Asistencia registrada correctamente");
      } else {
        console.error("El API devolvió un error:", response);
        alert("Hubo un problema al registrar la asistencia. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia. Por favor, inténtalo más tarde.");
    } finally {
      setShowModal(false); // Cierra el modal
      setReason(""); // Resetea la razón
    }
  };

  // Maneja el clic en el botón de asistencia
  const handleButtonClick = () => {
    const [currentHour, currentMinute] = formState.currentTime.split(':').map(Number); // Obtiene la hora y minuto actuales
    if (currentHour >= 8 || (currentHour === 8 && currentMinute > 0)) {
      setShowModal(true); // Si es tarde, muestra el modal para ingresar la razón
    } else {
      handleAttendance(false); // Si es temprano, registra la asistencia como presente
    }
  };

  return (
    <div className="personal">
      <Navbar user={user} /> {/* Muestra el componente Navbar con la información del usuario */}
      <Header currentDate={formState.todayDate} /> {/* Muestra el componente Header con la fecha actual */}
      <div className="posts-personal">
        <div className="e-card">
          {/* Animaciones de fondo en función de la hora del día */}
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '210px' }}></div>
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '420px' }}></div>

          <div className="content-user">
            {/* Muestra la imagen de perfil o un avatar por defecto */}
            <img
              src={user.profilePicture || defaultAvatar}
              alt="User Icon"
              className="icon"
            />
            <div className="user-info text-white">
              <div className="user-name">{userName}</div> {/* Nombre del usuario */}
              <div className="user-department">{user.account.username}</div> {/* Departamento o nombre de la cuenta */}
            </div>
          </div>

          {/* Botón para registrar la asistencia */}
          <button
            onClick={handleButtonClick}
            disabled={isButtonDisabled} // Deshabilita el botón si no está permitido registrar asistencia
          >
            Enviar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 74 74"
              height="34"
              width="34"
            >
              {/* Icono del botón */}
              <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
              <path
                fill="black"
                d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
              ></path>
            </svg>
          </button>
        </div>

        {/* Modal que se muestra cuando el usuario llega tarde */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <div className="modal-content">
            <p>¿Por qué llegaste tarde?</p>
            <textarea
              placeholder="Escribe aquí la razón de tu asistencia"
              value={reason}
              onChange={(e) => setReason(e.target.value)} // Actualiza la razón cuando el usuario escribe
            />
            <button onClick={() => handleAttendance(true)}>Confirmar</button> {/* Llama a handleAttendance con 'true' para indicar que el usuario llegó tarde */}
          </div>
        </Modal>
      </div>
    </div>
  );
};
