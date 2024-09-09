import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import "./appointment.css";
import { Input } from "../Input";


export const AppointmentNew = () => {
  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState({
    note: {
      value: "",
      isValid: true,
      showError: false,
    },
  });


  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
  ];

  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    setDate(previousDay);
  };

  const handleInputValueChange = (value, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
      },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid: true,
        showError: false,
      },
    }));
  };

  const handleCancel = () => {
    setFormData({
      note: {
        value: "",
        isValid: true,
        showError: false,
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `Cita agendada para ${formattedDate} con nota: ${formData.note.value}`
    );
  };

  const isSubmitButtonDisabled = !formData.note.value;

  return (
    <div className="appointment-container">
      <div className="appointment-title-container">
        <h1>Create Appointment</h1>
        <div className="title-separator"></div>
      </div>
      <div className="appointment-container__content">
        <div className="form-appointment-container">
          <div className="form-appointment-container__title">
            <h1>Nota</h1>
          </div>
          <Input
            field="note"
            value={formData.note.value}
            onChangeHandler={handleInputValueChange}
            onBlurHandler={handleInputValidationOnBlur}
            type="text"
            showErrorMessage={formData.note.showError}
            validationMessage=""
            textarea
          />
          <div className="buttons-container">
            <button
              onClick={handleSubmit}
              disabled={isSubmitButtonDisabled}
              className="button-agendar"
            >
              Agendar
            </button>
            <button onClick={handleCancel} className="button-cancelar">
              Cancelar
            </button>
          </div>
        </div>
        <div className="Date-appointment-container">
          <div className="Date-tile-container">
            <h1>Fecha: {formattedDate}</h1>
          </div>
          <div className="Date-container">
            {availableTimes.map((time, index) => (
              <div className="time-slot" key={index}>
                {time}
              </div>
            ))}
          </div>
          <div className="input-button-container">
            <button onClick={handlePreviousDay} className="arrow-button">
              <FaArrowLeft />
            </button>
            <button onClick={handleNextDay} className="arrow-button">
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
