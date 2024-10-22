/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import { Input } from '../../components/Input';
import { useCreateUser } from '../../shared/hooks/useCreateUser';
import { useNavigate } from 'react-router-dom';
import logoGAE from '../../assets/img/SmallLogo.jpg';
import { registerValidationMessages, validateRegister } from '../../shared/validators';
import './createUser.css';
import { useFetchUnityToday } from '../../shared/hooks/useFetchUnityToday';

export const CreateUser = () => {
    const { createUser, isLoading } = useCreateUser();
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        name: { value: '', isValid: false, showError: false },
        username: { value: '', isValid: false, showError: false },
        email: { value: '', isValid: false, showError: false },
        password: { value: '', isValid: false, showError: false },
        description: { value: '', isValid: true, showError: false },
        photo: { value: '', isValid: true, showError: false },
        role: { value: 'ADMIN_ROLE', isValid: true, showError: false },
        unidadId: { value: '', isValid: true, showError: false },
    });

    const { allUnits, error } = useFetchUnityToday();

    useEffect(() => {
        console.log('Fetched Units:', allUnits);
    }, [allUnits]);

    const handleInputChange = (value, field) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                value,
            },
        }));
    };

    const handleValidationOnBlur = (value, field) => {
        const isValid = validateRegister(field, value);
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                isValid,
                showError: !isValid,
            },
        }));
    };

    const handleCreateUser = (event) => {
        event.preventDefault();
        const userData = {
            name: formState.name.value,
            username: formState.username.value,
            email: formState.email.value,
            password: formState.password.value,
            description: formState.description.value,
            photo: formState.photo.value,
            role: formState.role.value,
            unidadId: formState.unidadId.value,
        };

        console.log("User Data:", userData);

        createUser(userData)
            .then(() => {
                console.log("User created successfully");
                navigate('/dashboard/users');
            })
            .catch(err => {
                console.error("Error creating user:", err);
            });
    };

    const handleUnitValidationOnBlur = () => {
        const isValid = formState.unidadId.value !== '';
        setFormState((prevState) => ({
            ...prevState,
            unidadId: {
                ...prevState.unidadId,
                isValid,
                showError: !isValid,
            },
        }));
    };

    const isSubmitDisabled = isLoading || !Object.values(formState).every((field) => field.isValid);

    return (
        <div className="create-user-auth-container">
            <div className="create-user-form-container">
                <form className="create-user-auth-form" onSubmit={handleCreateUser}>
                    <div className="create-user-logo-container">
                        <img src={logoGAE} alt="GAE Logo" />
                        <div>
                            <h1>Gobierno Electrónico</h1>
                        </div>
                    </div>
                    <div className="create-user-logo-separator"></div>
                    <div className="create-user-input-container">
                        <Input
                            className="create-user-input-field"
                            field='name'
                            label='Name'
                            value={formState.name.value}
                            onChangeHandler={(value) => handleInputChange(value, 'name')}
                            type='text'
                            onBlurHandler={(value) => handleValidationOnBlur(value, 'name')}
                            showErrorMessage={formState.name.showError}
                            validationMessage={registerValidationMessages.name}
                        />
                        <Input
                            className="create-user-input-field auth-form-input-username"
                            field='username'
                            label='Username'
                            value={formState.username.value}
                            onChangeHandler={(value) => handleInputChange(value, 'username')}
                            type='text'
                            onBlurHandler={(value) => handleValidationOnBlur(value, 'username')}
                            showErrorMessage={formState.username.showError}
                            validationMessage={registerValidationMessages.username}
                        />
                        <Input
                            className="create-user-input-field"
                            field='email'
                            label='Email'
                            value={formState.email.value}
                            onChangeHandler={(value) => handleInputChange(value, 'email')}
                            type='text'
                            onBlurHandler={(value) => handleValidationOnBlur(value, 'email')}
                            showErrorMessage={formState.email.showError}
                            validationMessage={registerValidationMessages.email}
                        />
                        <Input
                            className="create-user-input-field auth-form-input-password"
                            field='password'
                            label='Password'
                            value={formState.password.value}
                            onChangeHandler={(value) => handleInputChange(value, 'password')}
                            type='password'
                            onBlurHandler={(value) => handleValidationOnBlur(value, 'password')}
                            showErrorMessage={formState.password.showError}
                            validationMessage={registerValidationMessages.password}
                        />
                        <div className="create-user-input-field">
                            <label htmlFor="unidadId">Unidad</label>
                            {error ? (
                                <p>Error al cargar las unidades: {error}</p>
                            ) : allUnits.length === 0 ? (
                                <p>No se encontraron unidades</p>
                            ) : (
                                <select
                                    id="unidadId"
                                    value={formState.unidadId.value}
                                    onChange={(e) => handleInputChange(e.target.value, 'unidadId')}
                                    onBlur={handleUnitValidationOnBlur}
                                    disabled={false}
                                >
                                    <option value="">Selecciona una Unidad</option>
                                    {allUnits.map((unit) => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.nameUnity}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <button
                        className="create-user-button"
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        Create User
                    </button>
                </form>
                <span onClick={() => navigate('/dashboard/personal')} className="create-user-switch-label">
                    Volver al Dashboard
                </span>
            </div>
        </div>
    );
};
