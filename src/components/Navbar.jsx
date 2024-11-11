import logo from "../assets/img/BigLogoWhite.png";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getReporteData } from '../services/api.jsx'; // Cambia la ruta por la correcta


export const Navbar = () => {
  const userId = JSON.parse(localStorage.getItem('datosUsuario'))?.account?.homeAccountId;
  
  // Definir estados y efectos en el nivel del componente
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  useEffect(() => {
    // Obtener el último reporte desde el backend
    const fetchReporte = async () => {
      try {
        const response = await getReporteData();
        if (response.error) {
          console.error('Error al obtener el reporte:', response.e);
          return;
        }
        setAttendanceRecords(response.data.reportes || []);
      } catch (error) {
        console.error('Error al obtener el reporte:', error);
      }
    };
    fetchReporte();
  }, []); // Solo se ejecuta una vez al montar el componente

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
    // Si no hay registros, no hacer nada
    if (attendanceRecords.length === 0) {
      alert('No hay registros para exportar');
      return;
    }

    // Crear el archivo Excel con los registros
    const worksheet = XLSX.utils.json_to_sheet(attendanceRecords);
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
        <button onClick={exportToExcel} className="export-btn">
          Exportar a Excel
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
