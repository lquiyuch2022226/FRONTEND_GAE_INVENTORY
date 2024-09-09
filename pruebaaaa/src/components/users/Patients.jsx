import React, { useState } from 'react';
import { usePatients } from '../../shared/hooks/usePatients';
import { updatePatientProgress } from '../../services/api';
import { Navbar } from "../../components/Navbar";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import './patients.css';

export const Patients = () => {

    const { patients, loading, error } = usePatients();
    const [editing, setEditing] = useState(null);
    const [progress, setProgress] = useState({});
    const { username } = useUserDetails();

    const handleEdit = (id, currentProgress) => {

        setEditing(id);
        setProgress({ ...progress, [id]: currentProgress });
    };

    const handleChange = (e, id) => {

        setProgress({ ...progress, [id]: e.target.value });
    };

    const handleSave = async (id) => {

        await updatePatientProgress(id, { progress: progress[id] });
        setEditing(null);
    };

    return (
        <div className="patients-management">
            <Navbar user={username} />
            <div className="header">
                <h1>Gestión de Pacientes</h1>
            </div>
            <div className="patients-table">
                {loading && <p>Cargando...</p>}
                {error && <p>Error al cargar los pacientes.</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Progreso</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>{patient.username}</td>
                                    <td>
                                        {editing === patient.id ? (
                                            <input
                                                type="text"
                                                value={progress[patient.id] || ''}
                                                onChange={(e) => handleChange(e, patient.id)}
                                            />
                                        ) : (
                                            patient.progress
                                        )}
                                    </td>
                                    <td>
                                        <img src={patient.photo} alt={patient.username} className="patient-photo" />
                                    </td>
                                    <td>
                                        {editing === patient.id ? (
                                            <button onClick={() => handleSave(patient.id)}>Guardar</button>
                                        ) : (
                                            <button onClick={() => handleEdit(patient.id, patient.progress)}>Actualizar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};