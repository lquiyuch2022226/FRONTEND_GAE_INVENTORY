import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar.jsx';
import { useNavigate } from "react-router-dom";
import { reportarEntrada } from '../../services/api.jsx';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import './personal.css';
import defaultAvatar from '../../assets/img/palmamorro.jpg';
import earlyImage from '../../assets/img/comprobado.png';
import lateImage from '../../assets/img/cerca.png';

export const Personal = () => {
  const user = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const navigate = useNavigate();
  const userId = user.account?.homeAccountId || "Invitado";
  const userName = user.account?.name || "Invitado";

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
    setAttendanceRecords(storedRecords);
  }, [userId]);

  const handleAttendance = async () => {
    const todayDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
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
      };

      const response = await reportarEntrada(record);

      if (response.error) {
        console.error(response.error);
        alert("Error al registrar la asistencia: " + response.error.message);
      } else {
        const updatedRecords = [...attendanceRecords, record];
        setAttendanceRecords(updatedRecords);
        localStorage.setItem(`attendanceRecords_${userId}`, JSON.stringify(updatedRecords));
        console.log("Registro de asistencia:", record);
        alert("Asistencia registrada correctamente");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Error al registrar la asistencia");
    }
  };

  const exportToExcel = () => {
    const todayDate = new Date().toISOString().split('T')[0]; // Obtén la fecha de hoy en formato YYYY-MM-DD
  
    // Filtra los registros que tengan la fecha de hoy
    const todayRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === todayDate;
    });
  
    // Crea el archivo Excel solo con los registros del día actual
    const worksheet = XLSX.utils.json_to_sheet(todayRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Asistencia");
    XLSX.writeFile(workbook, `Reporte_Asistencia_${todayDate}.xlsx`);
  };

  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
    selectedPersonal: {},
    selectedReason: {},
    reportSent: false,
    selectAll: false,
  });

  const usuarioLogueado = JSON.parse(localStorage.getItem('datosUsuario')) || {};
  const currentHour = new Date().getHours();
  const isOnTime = currentHour < 8 ? "A tiempo" : "Tarde";
  const imageToShow = currentHour < 8 ? earlyImage : lateImage;
  const backgroundColor = currentHour < 8 ? '#359100' : '#8b0000';
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];

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

  useEffect(() => {
    fetchInternetTime();
    const interval = setInterval(() => {
      setFormState((prevState) => {
        const updatedTime = new Date();
        updatedTime.setSeconds(updatedTime.getSeconds() + 1);
        return {
          ...prevState,
          currentTime: updatedTime.toTimeString().split(' ')[0],
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="personal">
      <Navbar user={usuarioLogueado} />

      <div className="posts-personal">
        {usuarioLogueado ? (
          <div className="e-card playing">
            <div className="image"></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})` }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '210px' }}></div>
            <div className="wave" style={{ background: `linear-gradient(744deg, ${waveColors[0]}, ${waveColors[1]} 60%, ${waveColors[2]})`, top: '420px' }}></div>

            <div className='content-user'>
              <div className="infotop">
                <img
                  src={usuarioLogueado.profilePicture || defaultAvatar}
                  alt="User Icon"
                  className="icon"
                />
                <div className="user-info text-white">
                  <div className="user-name">{usuarioLogueado.account.name}</div>
                  <div className="user-department">{usuarioLogueado.account.username}</div>
                </div>
              </div>
              <div className="date-time">
                <div className="card" style={{ background: backgroundColor }}>
                  <div className="card-content">
                    <div className="card-top">
                      <span className="card-title"></span>
                      <p>{isOnTime}</p>
                    </div>
                    <div className="card-bottom">
                      <p>{formState.todayDate}</p>
                      {formState.currentTime}
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
            <button onClick={handleAttendance}>
              <span>Continue</span>
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
            <button onClick={exportToExcel} className="export-btn">
              Exportar a Excel
            </button>
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
