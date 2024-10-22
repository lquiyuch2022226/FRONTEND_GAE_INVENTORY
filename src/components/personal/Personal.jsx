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
import { ReviewReport } from '../reviewReport/reviewReport.jsx';
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
  const [reportSent, setReportSent] = useState(false);
  const [lastReportDate, setLastReportDate] = useState(new Date().toISOString().split('T')[0]);

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




  useEffect(() => {
    const fetchUnityData = async () => {
      try {
        const response = await fetch(`/api/unidades/${userDetails.unidadId}`);
        const data = await response.json();
        setReportSent(data.reportSent);
      } catch (error) {
        console.log('Error fetching unidad data:', error);
      }
    };

    fetchUnityData();
  }, [userDetails.unidadId]);


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
    console.log(reportResponse, "reporte");
    console.log(fecha, "--------------------------------------------", todayDate);
    console.log(todayDate, "Fecha actual ---------", fechaDeLaUnidad, "fecha de envio de la unuidad")


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
      console.log(assistance.unity.dateOfReportByUnity, todayDate, "Datos para actualizar")

      try {
        await storeReporteData(allPersonalList, todayDate);
        console.log(allPersonalList, todayDate, "pepapig enviar fecah reporte");
        await actualizarUnidad(assistance.unity._id, assistance.unity);
        console.log(assistance.unity);
        toast.success('Informe enviado');

         setTimeout(() => {
          window.location.reload();

        }, 1000); 

      } catch (error) {
        console.error('Error al actualizar el reporte en la base de datos:', error);
        toast.error('Error al enviar el informe');
      }
    } else {
      console.log(assistance.unity.report, "ya enviado");
      toast.error('Ya se envió el informe de asistencia de hoy');
    }
  };

  const handleGenerateExcel = async () => {
    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      console.log("data del reporte", reportResponse.data.updatedAt, "fecha del reporte:", reportResponse.data.createAt);
  
      // Revisar si los datos de reportResponse están correctamente obtenidos
      console.log('Datos de reportResponse:', reportResponse);
  
      if (!reportResponse || !reportResponse.data || reportResponse.data.reportes.length === 0) {
        toast.error('No hay reportes disponibles para generar el Excel.');
        return;
      }
  
      // Asegúrate de que los reportes de diferentes departamentos estén separados
      const reportesPorDepartamento = {};
  
      // Procesar los datos de los reportes
      reportResponse.data.reportes.forEach((personal) => {
        const unityName = assistance?.unity?.nameUnity || personal.unidadId;
  
        // Si el departamento aún no está en el objeto, lo inicializamos
        if (!reportesPorDepartamento[unityName]) {
          reportesPorDepartamento[unityName] = [];
        }
  
        // Añadir el reporte de cada persona al departamento correspondiente
        reportesPorDepartamento[unityName].push({
          Nombre: personal.name || 'N/A',
          Apellido: personal.lastName || 'N/A',
          Extención: personal.number || 'N/A',
          Unidad: unityName,
          Asistencia: personal.selected ? 'No asistió' : 'Asistió',
          Razón: personal.reason || 'Sin justificar',
        });
      });
  
      // Crear el archivo Excel por cada departamento
      Object.keys(reportesPorDepartamento).forEach((departamento) => {
        const processedData = reportesPorDepartamento[departamento];
  
        // Crear el workbook de Excel y añadir la hoja con los datos procesados
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
  
        // Ajustar el tamaño de las columnas al contenido
        const columnWidths = [
          { wpx: 80 }, // Anchura para la columna "Nombre"
          { wpx: 80 }, // Anchura para la columna "Apellido"
          { wpx: 90 }, // Anchura para la columna "Nuúmero_De_Personal"
          { wpx: 110 }, // Anchura para la columna "Unidad"
          { wpx: 80 }, // Anchura para la columna "Asistencia"
          { wpx: 200 }, // Anchura para la columna "Razón"
        ];
        worksheet['!cols'] = columnWidths;
  
        XLSX.utils.book_append_sheet(workbook, worksheet, `Reportes_${departamento}`);
  
        // Convertir el workbook a un archivo Blob y descargarlo
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
        // Descargar el archivo Excel con un nombre único por departamento
        saveAs(blob, `Reportes_${departamento}_${new Date().toLocaleDateString()}.xlsx`);
      });
  
      // Actualizar la fecha de hoy después de generar el Excel
      localStorage.setItem('lastGeneratedDate', currentDate); // Almacenar la fecha actual
      toast.success('Excel generado y listo para descargar');
    } catch (e) {
      console.error(e);
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
        <div className="input-group-personal">
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
        <div>
          <div>
            <ReviewReport />
          </div>
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
