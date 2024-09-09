import React from 'react';
import { useSupporters } from '../../shared/hooks/useSupporters';
import { Navbar } from "../../components/Navbar";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import './supporters.css';

export const ProfesionalSupporter = () => {

    const { supporters, loading, error } = useSupporters();
    const { username } = useUserDetails();

    return (

        <div className="supporters-management">
            <Navbar user={username} />
            <div className="header">
                <h1>Profesionales de Apoyo</h1>
            </div>
            <div className="supporters-table">
                {loading && <p>Cargando...</p>}
                {error && <p>Error al cargar los profesionales de soporte.</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Username</th>
                                <th>Descripción</th>
                                <th>Foto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supporters.map((supporter) => (
                                <tr key={supporter.id}>
                                    <td>{supporter.name}</td>
                                    <td>{supporter.username}</td>
                                    <td>{supporter.description}</td>
                                    <td>
                                        <img src={supporter.photo} alt={supporter.username} className="supporter-photo" />
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