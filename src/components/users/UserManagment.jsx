import React from 'react';
import { Navbar } from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../shared/hooks/useUsers';
import { useUserDetails } from "../../shared/hooks/useUserDetails"
import './user.css';

export const UserManagement = () => {

    const navigate = useNavigate();

    const { users, loading, error } = useUsers();
    const { username } = useUserDetails();

    const handleCreateUser = () => {
        
        navigate('/create-user');
    };

    return (
        <div className="user-management">
            <div className="content">
                <div className="header">
                    <h1>Gestión de Usuarios</h1>
                    <button onClick={handleCreateUser}>Crear</button>
                </div>
                <div className="user-table">
                    {loading && <p>Cargando...</p>}
                    {error && <p>Error al cargar los usuarios.</p>}
                    {!loading && !error && (
                        Array.isArray(users) && users.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Username</th>
                                        <th>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay usuarios disponibles.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );

};
