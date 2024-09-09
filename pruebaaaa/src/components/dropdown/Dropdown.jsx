import React, { useState } from 'react';
import './dropdown.css';
import { Modal } from '../modal/Modal.jsx';

export const DropdownButton = ({ onSelect }) => {
  const [selectedReason, setSelectedReason] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customReason, setCustomReason] = useState('');

  const reasons = ["Enfermedad", "Viene Tarde", "Otro"];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (reason) => {
    if (reason === "Otro") {
      setShowModal(true); // Mostrar el modal cuando se selecciona "Otro"
    } else {
      setSelectedReason(reason); // Seleccionar una de las razones predefinidas
      setDropdownOpen(false); // Cerrar el dropdown
      onSelect(reason); // Pasar la razón seleccionada al padre
    }
  };

const handleSaveCustomReason = () => {
  if (customReason.trim() !== '') {
    setSelectedReason(customReason);
    onSelect(customReason);
    setShowModal(false);
    setDropdownOpen(false);
    setSelectedReason("Otro");
  }
};


  return (
    <div className="dropdown">
      <button className="btn" type="button" onClick={toggleDropdown}>
        {selectedReason === "default" ? "Selecciona una razón" : selectedReason}
      </button>
      <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
        {reasons.map(reason => (
          <a
            key={reason}
            className="dropdown-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSelect(reason);
            }}
          >
            {reason}
          </a>
        ))}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="input-group">
          <textarea
            required={true}
            type="text"
            value={customReason}
            className="input"
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Describe la razón"
          />
        </div>
        <div className='espacio'>
          <button className='button' onClick={handleSaveCustomReason}>
            <span>Guardar</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
