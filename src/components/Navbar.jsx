import logo from "../assets/img/BigLogoWhite.png";
export const Navbar = () => {

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
    
    window.location.href = 'https://frontend-gae-inventory-rkmq.vercel.app/';
  };

  return (
    <nav className="navbar-container">
      <div className="form-container-title__logo">
        <div className="logo-container">
          <img src={logo} alt="" className="logo" />
        </div>
      </div>
      <div className="navbar-center">
        <button></button>
        <button>Registrar Asistencia</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
