import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import { Modal } from '../modal/Modal.jsx';

export const DropdownButton = ({ onSelect }) => {
  const [selectedReason, setSelectedReason] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const modalRef = useRef(null);

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

  // Cerrar el modal si se hace clic fuera
/*   useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false); // Cerrar modal si se hace clic afuera
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]); */

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

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-content" ref={modalRef}>
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
            <button className='button-guardar' onClick={handleSaveCustomReason}>
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
