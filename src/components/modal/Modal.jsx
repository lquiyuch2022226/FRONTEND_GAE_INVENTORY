import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h4 className="modal-title">Razón</h4>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
