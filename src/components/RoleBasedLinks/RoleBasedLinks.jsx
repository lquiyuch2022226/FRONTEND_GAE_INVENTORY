import React from 'react';
import './roleBasedLinks.css';

export const RoleBasedLinks = () => {
  const handleLogout = () => {
    localStorage.removeItem('datosUsuario');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    localStorage.removeItem('attendanceRecords');
    
    const userId = JSON.parse(localStorage.getItem('datosUsuario'))?.account?.homeAccountId;
    if (userId) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`attendanceRecords_${userId}`)) {
          localStorage.removeItem(key);
        }
      });
    }
    
    window.location.href = 'http://localhost:5173/'; // Adjust this to your login path
  };

  return (
    <div className="role-based-menu">
      <div className="role-item">
        <a href="#" className="role-link">
          <span> Our Services </span>
          <svg viewBox="0 0 360 360" xmlSpace="preserve">
            <g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              ></path>
            </g>
          </svg>
        </a>
        <div className="role-submenu">
          <div className="role-submenu-item">
            <a href="#" className="role-submenu-link" onClick={handleLogout}> Logout </a>
          </div>
          <div className="role-submenu-item">
            <a href="#" className="role-submenu-link"> Design </a>
          </div>
          <div className="role-submenu-item">
            <a href="#" className="role-submenu-link"> Marketing </a>
          </div>
          <div className="role-submenu-item">
            <a href="#" className="role-submenu-link"> SEO </a>
          </div>
        </div>
      </div>
    </div>
  );
};
