import React, { useState, useEffect } from 'react';  // Importa React y los hooks useState, useEffect
import { Navbar } from '../Navbar.jsx'; // Importa el componente Navbar
import { useNavigate } from "react-router-dom";  // Importa el hook useNavigate para redirección (aunque no se utiliza aquí)
import { reportarEntrada } from '../../services/api.jsx'; // Importa la función reportarEntrada (no usada aquí)
import './personal.css';  // Importa los estilos para el componente Personal
import { Header } from '../header/Header.jsx';  // Importa el componente Header
import defaultAvatar from '../../assets/img/palmamorro.jpg';  // Importa una imagen predeterminada para el avatar

// Componente principal Personal
export const Personal = () => {
  // Obtiene los datos del usuario desde el localStorage, si no existen, asigna un objeto vacío
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  
  // Obtiene el ID de la cuenta y el nombre del usuario, si no existen, asigna valores predeterminados
  const userId = user.account?.homeAccountId || "Invitado";  
  const userName = user.account?.name || "Invitado";  
  
  // Obtiene la hora actual del sistema
  const currentHour = new Date().getHours();
  
  // Define los colores de la ola dependiendo de la hora del día
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

  // Estado que almacena los registros de asistencia
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  // Estado que almacena la fecha y hora actuales
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],  // Fecha de hoy (YYYY-MM-DD)
    currentTime: new Date().toTimeString().split(' ')[0],  // Hora actual (HH:MM:SS)
  });
  
  // Estado que controla la visibilidad del popup de confirmación
  const [showPopup, setShowPopup] = useState(false);
  
  // Estado que almacena la razón de la asistencia
  const [reason, setReason] = useState("");
  
  // Estado que habilita o deshabilita el botón de envío
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // useEffect que verifica si ya se registró la asistencia para hoy
  useEffect(() => {
    const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');  // Obtiene la última fecha de asistencia
    const today = new Date().toISOString().split('T')[0];  // Obtiene la fecha de hoy
    setIsButtonDisabled(lastAttendanceDate === today);  // Deshabilita el botón si ya se registró asistencia hoy
  }, []);  // Solo se ejecuta al cargar el componente

  // Función para manejar el registro de asistencia
  const handleAttendance = async () => {
    try {
      const record = {
        user: userName,
        date: formState.todayDate,
        time: formState.currentTime,
        reason,
      };
  
      // Aquí llamamos a la función reportarEntrada para enviar los datos al servidor
      const response = await reportarEntrada(record);
  
      if (response.success) {
        // Si la respuesta del servidor es exitosa, actualizamos el estado local y el localStorage
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
        localStorage.setItem('lastAttendanceDate', formState.todayDate);
        setIsButtonDisabled(true);
  
        // Muestra un mensaje de éxito
        alert("Asistencia registrada correctamente");
      } else {
        // Si la respuesta no es exitosa, muestra un mensaje de error
        alert("Error al registrar la asistencia en la base de datos");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia: " + error.message);
    } finally {
      setShowPopup(false);
      setReason("");
    }
  };
  
  // Función para verificar si la hora actual está dentro de un rango (entre las 3 AM y 12 PM)
  const isTimeInRange = () => {
    const currentHour = parseInt(formState.currentTime.split(':')[0], 10);  // Extrae la hora de la cadena de tiempo
    return currentHour >= 21 && currentHour < 24;  // Devuelve true si la hora está en el rango permitido
  };

  // JSX para renderizar la UI del componente
  return (
    <div className="personal">
      {/* Componente de la barra de navegación */}
      <Navbar user={user} />
      
      {/* Componente del encabezado que muestra la fecha actual */}
      <Header currentDate={formState.todayDate} />
      
      <div className="posts-personal">
        <div className="e-card">
          {/* Efecto de fondo con olas, cambia según la hora del día */}
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '210px' }}></div>
          <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '420px' }}></div>

          {/* Información del usuario */}
          <div className="content-user">
            {/* Imagen de perfil del usuario (si no tiene, usa la imagen predeterminada) */}
            <img
              src={user.profilePicture || defaultAvatar}
              alt="User Icon"
              className="icon"
            />
            <div className="user-info text-white">
              {/* Muestra el nombre del usuario */}
              <div className="user-name">{userName}</div>
              {/* Muestra el nombre de usuario (departamento) */}
              <div className="user-department">{user.account.username}</div>
            </div>
          </div>

          {/* Botón para enviar el registro de asistencia */}
          <button
            onClick={() => setShowPopup(true)}  // Muestra el popup al hacer clic
            disabled={isButtonDisabled || !isTimeInRange()}  // Deshabilita el botón si ya se registró asistencia o si la hora no está en el rango permitido
          >
            Enviar
            {/* Icono SVG del botón */}
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

        {/* Popup de confirmación cuando se presiona el botón */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>¿Estás seguro de que deseas registrar tu asistencia?</p>
              {/* Campo de texto para que el usuario ingrese la razón */}
              <textarea
                placeholder="Escribe aquí la razón de tu asistencia"
                value={reason}
                onChange={(e) => setReason(e.target.value)}  // Actualiza el estado de la razón
              />
              <button onClick={handleAttendance}>Confirmar</button>  {/* Botón para confirmar el registro de asistencia */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
