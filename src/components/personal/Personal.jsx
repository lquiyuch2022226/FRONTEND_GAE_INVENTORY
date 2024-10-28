import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Input } from "../Input.jsx";/* 
import { useFetchPersonal } from '../../shared/hooks/index.js'; */
import { useUpdateUnity } from "../../shared/hooks/useUpdateUnity";
import { useStoreReporte } from '../../shared/hooks/useStoreReporte.jsx';
import { useGenerarExcel } from '../../shared/hooks/useGenerarExcel.jsx';
/* import { useGetReport } from '../../shared/hooks/useGetReport.jsx'; */
/* import { ReviewReport } from '../reviewReport/reviewReport.jsx'; */
import './personal.css';
import toast from 'react-hot-toast';

export const Personal = () => {
  const [formState, setFormState] = useState({
    todayDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    selectedPersonal: {},
    selectedReason: {},
    reportSent: false,
    selectAll: false,
  });

  const { generateExcelForSelected, isGenerating } = useGenerarExcel();
/*   const { personales, isLoading: isLoadingPersonal, error } = useFetchPersonal(); */
  const usuarioLogueado = JSON.parse(localStorage.getItem('userProfile'));
  const { actualizarUnidad } = useUpdateUnity();
  const { storeReporteData } = useStoreReporte();
/*   const { reportResponse } = useGetReport(); */

  const isUserAllowedToGenerateExcel = usuarioLogueado.officeLocation === 'Recursos Humanos';

/*   useEffect(() => {
    if (personales && personales.personales) {
      const allChecked = personales.personales.reduce((acc, personal) => {
        acc[personal._id] = formState.selectAll;
        return acc;
      }, {});
      setFormState((prev) => ({ ...prev, selectedPersonal: allChecked }));
    }
  }, [formState.selectAll, personales]); */

  const handleEnviarReporte = async () => {
   /*  if (formState.todayDate === reportResponse.fecha) {
      toast.error('Ya se envió el informe de asistencia de hoy');
      return;
    }

    const allPersonalList = personales.personales.map((personal) => ({
      ...personal,
      selected: formState.selectedPersonal[personal._id] || false,
      reason: formState.selectedReason[personal._id] || "Sin justificar",
    }));

    try {
      await storeReporteData(allPersonalList, formState.todayDate);
      await actualizarUnidad(usuarioLogueado.officeLocation, { dateOfReportByUnity: formState.todayDate });
      toast.success('Informe enviado');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error al enviar el informe:', error);
      toast.error('Error al enviar el informe');
    } */
  };

  const handleGenerateExcel = async () => {
   /*  if (!reportResponse || !reportResponse.data || reportResponse.data.reportes.length === 0) {
      toast.error('No hay reportes disponibles para generar el Excel.');
      return;
    }

    const reportesPorDepartamento = reportResponse.data.reportes.reduce((acc, personal) => {
      const unityName = personal.unidadId;
      if (!acc[unityName]) acc[unityName] = [];
      acc[unityName].push({
        Nombre: personal.name || 'N/A',
        Apellido: personal.lastName || 'N/A',
        Extensión: personal.number || 'N/A',
        Unidad: unityName,
        Asistencia: personal.selected ? 'No asistió' : 'Asistió',
        Razón: personal.reason || 'Sin justificar',
      });
      return acc;
    }, {});

    Object.keys(reportesPorDepartamento).forEach((departamento) => {
      const processedData = reportesPorDepartamento[departamento];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      worksheet['!cols'] = [{ wpx: 80 }, { wpx: 80 }, { wpx: 90 }, { wpx: 110 }, { wpx: 80 }, { wpx: 200 }];
      XLSX.utils.book_append_sheet(workbook, worksheet, `Reportes_${departamento}`);

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `Reportes_${departamento}_${new Date().toLocaleDateString()}.xlsx`);
    });

    toast.success('Excel generado y listo para descargar'); */
  };

  return (
    <div className="personal">
      <div className="header-container">
        <div className="input-group-personal">
          <Input field="fecha" label="Fecha" value={formState.todayDate} type="text" disabled />
          <Input field="hora" label="Hora" value={formState.currentTime} type="text" disabled />
        </div>
        {/* <ReviewReport /> */}
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
    </div>
  );
};
