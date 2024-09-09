import React from 'react';
import './Modal.css';

export const Modal = ({ show, onClose, children }) => {
    return (
        <div className={`modal-overlay ${show ? 'show' : 'hide'}`}>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>X</button>
                <div className="modal-header">
                    <h4 className="modal-title">Razón</h4> 
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

