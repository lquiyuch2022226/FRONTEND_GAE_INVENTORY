import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/BigLogoWhite.png";
import { RoleBasedLinks } from "./RoleBasedLinks/RoleBasedLinks.jsx";
import { reportarEntrada } from '../services/api.jsx';
export const Navbar = () => {
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

    const record = {
      user: userName,
      date: todayDate,
      time: currentTime,
      status,
    };

    try {
     
      const response = await reportarEntrada(record);

      // Maneja la respuesta de la API
      if (response.error) {
        console.error(response.e);
        alert("Error al registrar la asistencia: " + response.e.message);
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

  return (
    <nav className="navbar-container">
      <div className="form-container-title__logo">
        <div className="logo-container">
          <img src={logo} alt="" className="logo" />
        </div>
      </div>
      <div className="navbar-center">
        <button onClick={() => navigate("/dashboard/personal")}>Informes</button>
        <button onClick={() => navigate("/dashboard/users")}>Usuarios</button>
        <button onClick={handleAttendance}>Registrar Asistencia</button>
      </div>
      <div className="navbar-right">
        <div className="dropdown">
          <RoleBasedLinks />
        </div>
      </div>
    </nav>
  );
};
