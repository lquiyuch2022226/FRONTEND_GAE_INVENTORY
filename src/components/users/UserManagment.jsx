import React from 'react';
import { Navbar } from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../shared/hooks/useUsers';
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import './user.css';
import editIcon from '../../assets/img/edit.png';
import deleteIcon from '../../assets/img/papelera.png';


export const UserManagement = () => {
    const navigate = useNavigate();
    const { users, loading, error } = useUsers();

    const handleCreateUser = () => {
        navigate('/create-user');
    };

    const handleEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    const handleDeleteUser = (userId) => {
        // Lógica para eliminar el usuario
        console.log(`Eliminar usuario con ID: ${userId}`);
    };

    return (
        <div className="user-management">
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
                                    <th>Email</th>
                                    <th>Unidad</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.unidadId.nameUnity}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEditUser(user.id)}>
                                                    <img src={editIcon} alt="Editar" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.id)}>
                                                    <img src={deleteIcon} alt="Eliminar" />
                                                </button>
                                            </div>
                                        </td>
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
    );
};
