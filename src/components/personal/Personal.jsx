import React, { useState } from 'react';
import { Input } from "../Input.jsx";
import { useUpdateUnity } from "../../shared/hooks/useUpdateUnity";
import { useStoreReporte } from '../../shared/hooks/useStoreReporte.jsx';
import { useGenerarExcel } from '../../shared/hooks/useGenerarExcel.jsx';
import './personal.css';
import defaultAvatar from '../../assets/img/palmamorro.jpg'; // Imagen predeterminada
import earlyImage from '../../assets/img/comprobado.png'; // Imagen para antes de las 8 AM
import lateImage from '../../assets/img/cerca.png'; // Imagen para después de las 8 AM

export const Personal = () => {
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0],
    selectedPersonal: {},
    selectedReason: {},
    reportSent: false,
    selectAll: false,
  });

  const { generateExcelForSelected, isGenerating } = useGenerarExcel();
  const usuarioLogueado = JSON.parse(localStorage.getItem('datosUsuario'));
  const usuarioDepartamento = JSON.parse(localStorage.getItem('userProfile'));
  const { actualizarUnidad } = useUpdateUnity();
  const { storeReporteData } = useStoreReporte();

  const isUserAllowedToGenerateExcel = usuarioLogueado?.officeLocation === 'Recursos Humanos';

  const handleEnviarReporte = async () => {
    // Lógica para enviar el reporte...
  };

  const handleGenerateExcel = async () => {
    // Lógica para generar el Excel...
  };

  // Determinar si es a tiempo o tarde
  const currentHour = new Date().getHours();
  const isOnTime = currentHour < 8 ? "A tiempo" : "Tarde";

  // Seleccionar la imagen basada en la hora
  const imageToShow = currentHour < 8 ? earlyImage : lateImage;

// Establecer el color de fondo
const backgroundColor = currentHour < 8 ? '#359100' : '#8b0000'; // Verde para antes de las 8 AM, Rojo para después

  return (
    <div className="personal">
      <div className="header-container">
        <div className="buttons-group">
          <button className="pushable" onClick={handleEnviarReporte} disabled={isGenerating || formState.reportSent}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">Enviar</span>
          </button>
          {isUserAllowedToGenerateExcel && (
            <button className="pushable" onClick={handleGenerateExcel} disabled={isGenerating}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front">Generar Excel</span>
            </button>
          )}
        </div>
      </div>
      <div className="posts-personal">
        {usuarioLogueado ? (
          <div className="e-card playing">
            <div className="image"></div>

            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>

            <div className="infotop">
              <img
                src={defaultAvatar}
                alt="User Icon"
                className="icon"
              />
              <br />
              {usuarioLogueado.account.name}
              <br />
              <div className="name">{usuarioDepartamento.officeLocation}</div>
              <div className="date-time">
                <div className="card" style={{ background: backgroundColor }}>
                  <div className="card-content">
                    <div className="card-top">
                      <span className="card-title">{isOnTime}</span>
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
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
