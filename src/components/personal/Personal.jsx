import React, { useState } from 'react';
import { Navbar } from '../Navbar.jsx';
import './personal.css';
import defaultAvatar from '../../assets/img/palmamorro.jpg';
import earlyImage from '../../assets/img/comprobado.png';
import lateImage from '../../assets/img/cerca.png';

export const Personal = () => {
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

  // Green colors for waves
  const waveColors = currentHour < 8 ? ['#030e2e', '#023a0e', '#05a00d'] : ['#8b0000', '#b22222', '#ff4500'];
  return (
    <div className="personal">
      <Navbar user={usuarioLogueado} /> {/* Pasando el nombre del usuario al Navbar */}
   
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
                  src={defaultAvatar}
                  alt="User Icon"
                  className="icon"
                />
                <div className="user-info text-white">
                  <div className="user-name">{usuarioLogueado.account.name}</div>
                  <div className="user-department">{usuarioLogueado.officeLocation}</div>
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
          </div>
        ) : (
          <p>No hay datos del usuario disponibles.</p>
        )}
      </div>
    </div>
  );
};
