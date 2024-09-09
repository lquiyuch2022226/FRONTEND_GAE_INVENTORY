import React, { useState } from 'react';
import { Input } from '../../components/Input';
import { useCreateUser } from '../../shared/hooks/useCreateUser';
import { useNavigate } from 'react-router-dom';
import logoGAE from '../../assets/img/SmallLogo.jpg';
import { registerValidationMessages, validateRegister } from '../../shared/validators';
import './createUser.css';

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
        createUser(userData).then(() => {

            navigate('/dashboard');
        });
    };

    const isSubmitDisabled = isLoading || !Object.values(formState).every((field) => field.isValid);

    return (
        <div className="auth-container">
            <div className="create-user-container">
                <form className="auth-form" onSubmit={handleCreateUser}>
                    <div className="auth-logo-container">
                        <img src={logoGAE} alt="GAE Logo" />
                        <div>
                            <h1>Gobierno Electrónico</h1>
                        </div>
                    </div>
                    <div className="logo-separator"></div>
                    <div className="input-container">
                        <Input
                            className="input-field"
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
                            className="input-field"
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
                            className="input-field"
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
                            className="input-field"
                            field='password'
                            label='Password'
                            value={formState.password.value}
                            onChangeHandler={(value) => handleInputChange(value, 'password')}
                            type='password'
                            onBlurHandler={(value) => handleValidationOnBlur(value, 'password')}
                            showErrorMessage={formState.password.showError}
                            validationMessage={registerValidationMessages.password}
                        />
                        <Input
                            className="input-field"
                            field='photo'
                            label='Photo URL'
                            value={formState.photo.value}
                            onChangeHandler={(value) => handleInputChange(value, 'photo')}
                            type='text'
                        />
                        <Input
                            className="input-field"
                            field='description'
                            label='Description'
                            value={formState.description.value}
                            onChangeHandler={(value) => handleInputChange(value, 'description')}
                            type='text'
                        />
                        <div className="input-field">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={formState.role.value}
                                onChange={(e) => handleInputChange(e.target.value, 'role')}
                            >
                                <option value="ADMIN_ROLE">Administrador</option>
                                <option value="USER_ROLE">Usuario Normal</option>
                            </select>
                        </div>
                        <Input
                            className="input-field"
                            field='unidadId'
                            label='UnidadId'
                            value={formState.unidadId.value}
                            onChangeHandler={(value) => handleInputChange(value, 'unidadId')}
                            type='text'
                        />
                    </div>
                    <button  className="buttonCreateUser" type="submit" disabled={isSubmitDisabled}>
                        Create User
                    </button>
                </form>
                <span onClick={() => navigate('/dashboard')} className="auth-form-switch-label">
                    Volver al Dashboard
                </span>
            </div>
        </div>
    );
};
