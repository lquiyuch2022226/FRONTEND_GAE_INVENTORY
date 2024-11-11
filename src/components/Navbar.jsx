import logo from "../assets/img/BigLogoWhite.png";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getReporteData } from '../services/api.jsx';

export const Navbar = () => {
  const userId = JSON.parse(localStorage.getItem('datosUsuario'))?.account?.homeAccountId;
  const userEmail = JSON.parse(localStorage.getItem('datosUsuario'))?.account?.username;

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getReporteData();

        if (response.error) {
          console.error('Error al obtener el reporte:', response.e);
          return;
        }

        if (response.data.reportes.length === 0) {
          setAttendanceRecords([]);
        } else {
          setAttendanceRecords(response.data.reportes || []);
        }

      } catch (error) {
        console.error('Error al obtener el reporte:', error);
      }
    };

    fetchReporte();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('datosUsuario');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');

    if (userId) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`attendanceRecords_${userId}`)) {
          localStorage.removeItem(key);
        }
      });
    }

    window.location.href = 'https://frontend-gae-inventory-rkmq.vercel.app/';
  };

  const exportToExcel = () => {
    if (attendanceRecords.length === 0) {
      alert('No hay registros para exportar');
      return;
    }

    const recordsWithoutId = attendanceRecords.map(({ _id, ...rest }) => ({
      "Nombre": rest.name,
      "Fecha": rest.date,
      "Hora de Entrada": rest.time,
      "Estado": rest.status,
      "IP del dispositivo": rest.ip,
      "Razón": rest.reason
    }));

    const worksheet = XLSX.utils.json_to_sheet(recordsWithoutId);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Asistencia");
    XLSX.writeFile(workbook, `Reporte_Asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <nav className="navbar-container">
      <div className="form-container-title__logo">
        <div className="logo-container">
          <img src={logo} alt="" className="logo" />
        </div>
      </div>
      <div className="navbar-center">
        <label>Registro de asistencia</label>
        {userEmail === 'Jose.delacerda@transparencia.gob.gt' && (
          <button onClick={exportToExcel} className="export-btn">
            Exportar a Excel
          </button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
