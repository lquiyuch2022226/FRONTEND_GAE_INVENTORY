import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; 
import { Input } from "../Input.jsx";
import { useNavigate } from "react-router-dom";
import { useFetchPersonal } from '../../shared/hooks/index.js';
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import { useUpdateUnity } from "../../shared/hooks/useUpdateUnity";
import { useFetchUnity } from '../../shared/hooks/useFetchUnity.jsx';
import { useStoreReporte } from '../../shared/hooks/useStoreReporte.jsx';
import { useGenerarExcel } from '../../shared/hooks/useGenerarExcel.jsx';
import { useGetReport } from '../../shared/hooks/useGetReport.jsx';
import { DropdownButton } from '.././dropdown/Dropdown.jsx';
import './personal.css';
import toast from 'react-hot-toast';

export const Personal = () => {
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState({});
  const [selectedReason, setSelectedReason] = useState({});
  const [showCustomReasonInput, setShowCustomReasonInput] = useState(false);
  const [message, setMessage] = useState('');
  const [fechaDeLaUnidad, setFechaDeLaUnidad] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [reportSent, setReportSent] = useState(false);

  const { generateExcelForSelected, isGenerating } = useGenerarExcel();
  const { personales, isLoading: isLoadingPersonal, error } = useFetchPersonal();
  const now = new Date();
  const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
  const { userDetails, setReport } = useUserDetails();
  const { actualizarUnidad, response } = useUpdateUnity();
  const { storeReporteData } = useStoreReporte();
  const { reportResponse, fechaReport } = useGetReport();
  const { report } = useGenerarExcel();
  const { assistance, fecha } = useFetchUnity(userDetails.unidadId);

  const isUserAllowedToGenerateExcel = userDetails.unidadId === '66df5b59a530991563dc71b8';

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setTodayDate(currentDate);

    if (fecha) {
      const fechaUnity = new Date(fecha).toISOString().split('T')[0];
      setFechaDeLaUnidad(fechaUnity);
    }
  }, [fecha]);

  const handleReasonSelect = (reason, id) => {
    if (reason === 'Otro') {
      setCurrentPersonalId(id);
      setShowCustomReasonInput(true);
    } else {
      setSelectedReason((prevSelected) => ({
        ...prevSelected,
        [id]: reason,
      }));
    }
  };


  const handleCheckboxClick = (id) => {
    const tile = document.getElementById(`tile-${id}`);
    if (tile) {
      tile.classList.add("animate");
      setTimeout(() => {
        tile.classList.remove("animate");
      }, 1020); // Duración de la animación
    }
  };
  
  
  const handleEnviarReporte = async () => {
    if (todayDate !== fechaDeLaUnidad) {
      const allPersonalList = personales.personales.map((personal) => {
        const isSelected = selectedPersonal[personal._id] || false;
        const reason = isSelected
          ? (selectedReason[personal._id] || "Sin justificar")
          : " ";
  
        return {
          ...personal,
          selected: isSelected,
          reason: reason,
        };
      });
  
      assistance.unity.report = false;
      assistance.unity.dateOfReportByUnity = todayDate;
  
      try {
        await storeReporteData({
          listado: allPersonalList,
          nameUnity: assistance.unity.nameUnity // Enviar el nombre de la unidad
        });
        await actualizarUnidad(assistance.unity._id, assistance.unity);
        toast.success('Informe enviado');
  
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error('Error al enviar el informe');
      }
    } else {
      toast.error('Ya se envió el informe de asistencia de hoy');
    }
  };
  
  const handleGenerateExcel = async () => {
    try {
      console.log('Iniciando la generación del Excel...');
      const { unities, isLoading, error } = useFetchAllUnities(); // Obtenemos todas las unidades
  
      if (isLoading) {
        console.log('Cargando unidades...');
        toast.error('Cargando unidades, por favor espera');
        return;
      }
  
      if (error) {
        console.error('Error al cargar las unidades:', error);
        toast.error('Hubo un error al cargar las unidades');
        return;
      }
  
      if (reportResponse.data.reportes.length > 0) {
        // Crear un diccionario de unidades por unidadId para rápido acceso
        const unityMap = unities.reduce((map, unity) => {
          map[unity._id] = unity.nameUnity;
          return map;
        }, {});
  
        console.log('Diccionario de unidades:', unityMap);
  
        const processedData = reportResponse.data.reportes.map((personal) => {
          const unidadName = unityMap[personal.unidadId] || personal.unidadId;
          console.log('Procesando datos de:', personal.name, 'Unidad:', unidadName);
  
          return {
            name: personal.name,
            lastName: personal.lastName,
            number: personal.number,
            unidad: unidadName, // Usar nameUnity si está disponible
            reason: personal.reason,
            selected: personal.selected ? 'Asistió' : 'No asistió', // Cambiar true/false por Asistió/No asistió
          };
        });
  
        console.log('Datos procesados para el Excel:', processedData);
  
        // Generar el archivo Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
  
        console.log('Generando el archivo Excel...');
  
        // Convertir el workbook a un archivo blob para que se pueda descargar
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
        console.log('Guardando el archivo Excel...');
        saveAs(blob, `Reportes_${new Date().toLocaleDateString()}.xlsx`);
  
        toast.success('Excel generado y listo para descargar');
      } else {
        console.log('No hay informes enviados');
        toast.error('No hay informes enviados');
      }
    } catch (e) {
      console.error('Error al generar el Excel:', e);
      toast.error('Hubo un problema al generar el Excel');
    }
  };
  
  
  const [formState, setFormState] = useState({
    fecha: {
      value: "",
      isValid: false,
      showError: false,
    },
    hora: {
      value: "",
      isValid: false,
      showError: false,
    },
  });
  

  useEffect(() => {
    if (personales && personales.personales) {
      const allChecked = personales.personales.reduce((acc, personal) => {
        acc[personal._id] = selectAll;
        return acc;
      }, {});
      setSelectedPersonal(allChecked);
    }
  }, [selectAll, personales]);

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
        isValid: value !== '',
      },
    }));
  
    if (formState.fecha.isValid && formState.hora.isValid) {
      const tile = document.getElementById(`tile-${field}`);
      if (tile) {
        tile.classList.add("animate");
        setTimeout(() => {
          tile.classList.remove("animate");
        }, 5000);
      }
    }
  };
  
  const isSubmitButtonDisabled = !formState.fecha.isValid || !formState.hora.isValid;



  const handleCheckboxChange = (e, id) => {
    setSelectedPersonal((prevSelected) => ({
      ...prevSelected,
      [id]: e.target.checked,
    }));
  };

  return (
    <div className="personal">
      <div className="header-container">
        <div className="input-group">
          <Input
            field="fecha"
            label="Fecha"
            value={todayDate}
            onChangeHandler={handleInputValueChange}
            type="text"
            disabled={true}
          />
          <Input
            field="hora"
            label="Hora"
            value={currentTime}
            onChangeHandler={handleInputValueChange}
            type="text"
            disabled={true}
          />
        </div>
        <div className="buttons-group">
          <button
            className="pushable"
            onClick={handleEnviarReporte}
            disabled={isGenerating || reportSent || isSendingReport}
          >
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">Enviar</span>
          </button>
  
          {isUserAllowedToGenerateExcel && (
            <button className="pushable" onClick={handleGenerateExcel} disabled={isGenerating || report}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front">Generar Excel</span>
            </button>
          )}
        </div>
      </div>
      <div className="posts-personal">
        {isLoadingPersonal ? (
          <p>Cargando empleados...</p>
        ) : error ? (
          <p>Error al cargar empleados: {error.message}</p>
        ) : personales.personales.length > 0 ? (
          <div className="employee-container">
            {personales.personales.map((personal) => (
              <div className="checkbox-wrapper-16" key={personal._id}>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedPersonal[personal._id] || false}
                    onChange={(e) => handleCheckboxChange(e, personal._id)}
                    onClick={() => handleCheckboxClick(personal._id)} 
                  />
                  <span className={`checkbox-tile ${selectedPersonal[personal._id] || formState.fecha.isValid && formState.hora.isValid ? 'animate' : ''}`} id={`tile-${personal._id}`}>
                    <div className="checkbox-container">
                      <div className="checkbox-info">
                        <h3>{`${personal.name} ${personal.lastName}`}</h3>
                        <p>{personal.number}</p>
                      </div>
                      {selectedPersonal[personal._id] && (
                        <div className="checkbox-dropdown">
                          <DropdownButton
                            onSelect={(reason) => {
                              handleReasonSelect(reason, personal._id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay empleados disponibles.</p>
        )}
      </div>
    </div>
  );
  
  
};  
