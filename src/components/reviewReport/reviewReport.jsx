/* import React from 'react';
import { useFetchUnityToday } from '../../shared/hooks/useFetchUnityToday';
import './reviewReport.css';

export const ReviewReport = ({ unityId }) => {
  const { reportCount, missingUnits, allUnits, updatedUnits, isLoading, error } = useFetchUnityToday();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const allUnitsReported = updatedUnits.length === allUnits.length;
  const noUnitsReported = updatedUnits.length === 0;

  return (
    <>
      <a href="#review-modal" className="review-report-link" id="modal-closed">Unidades</a>

      <div className="review-modal-overlay" id="review-modal">
        <div className="review-modal-content">
          <div className="review-modal-header">
            <h1 className="review-modal-title">Unidades</h1>
            <p className="review-modal-subtitle">
              Cantidad de unidades que han enviado su reporte: {reportCount}
            </p>
          </div>
          <div className="review-modal-body">
            {noUnitsReported ? (
              <span>Ninguna unidad ha enviado su reporte hoy.</span>
            ) : allUnitsReported ? (
              <span>Todas las unidades han enviado su reporte hoy.</span>
            ) : (
              <span>
                Las unidades que faltan de enviar el reporte son:{" "}
                {missingUnits.map(unit => unit.nameUnity).join(", ")}
              </span>
            )}
          </div>
          <a href="#modal-closed" className="close-review-modal-link"></a>
        </div>
      </div>
    </>
  );
};
 */