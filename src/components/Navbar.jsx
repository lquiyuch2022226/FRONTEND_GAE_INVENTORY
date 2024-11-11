import logo from "../assets/img/BigLogoWhite.png";
export const Navbar = () => {

  const handleLogout = () => {
    const userId = JSON.parse(localStorage.getItem('datosUsuario'))?.account?.homeAccountId;
    localStorage.removeItem('datosUsuario');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    const [attendanceRecords, setAttendanceRecords] = useState([]);


    const [formState, setFormState] = useState({
      todayDate: new Date().toISOString().split('T')[0],
      currentTime: new Date().toTimeString().split(' ')[0]
    });
  
    useEffect(() => {
      const storedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
      setAttendanceRecords(storedRecords);
    }, [userId]);

    
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
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
      const storedRecords = JSON.parse(localStorage.getItem(`attendanceRecords_${userId}`)) || [];
      setAttendanceRecords(storedRecords);
    }, [userId]);

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
