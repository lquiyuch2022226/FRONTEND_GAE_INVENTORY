import { useState, useEffect } from "react";
import logoGE from "../assets/img/SmallLogo.jpg";
import { Input } from "./Input";
import {
  emailValidationMessage,
  passwordValidationMessage,
  validateEmail,
  validatePassword,
} from "../shared/validators";
import { useLogin } from "../shared/hooks";
import * as msal from '@azure/msal-browser'; // Import MSAL
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const msalConfig = {
  auth: {
    clientId: 'cec5f4e6-e5cf-4897-8c2d-143722d79b5d', // Tu clientId
    authority: 'https://login.microsoftonline.com/4e5a94e9-e691-484d-a509-0f12ed40cce5', // Tu tenant ID
    redirectUri: 'http://localhost:5173/dashboard/personal', // URI de redirección
    postLogoutRedirectUri: 'http://localhost:5173/', // Opcional
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export const Login = ({ switchAuthHandler }) => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    email: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
  });

  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
      } catch (initError) {
        console.error("MSAL initialization error:", initError);
        setError('Failed to initialize authentication service.');
      }
    };
    initializeMSAL();
  }, []);

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      default:
        break;
    }
    setFormState((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], isValid, showError: !isValid },
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await login(formState.email.value, formState.password.value);
    if (result.error) {
      setError("Login failed. Please check your credentials.");
    } else {
      setFormState({
        email: { value: "", isValid: false, showError: false },
        password: { value: "", isValid: false, showError: false },
      });
      setError(null);
      navigate('/dashboard/personal');
    }
  };

  const loginWithMicrosoft = async () => {
    const loginRequest = {
      scopes: ['openid', 'profile', 'email'],
    };
  
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const token = response.accessToken;
  
      // Log the token and user information
      console.log("User logged in successfully:", response.account); // Log user info
      console.log("Access Token:", token); // Log the access token
  
      const loginResponse = await login(token);
  
      if (loginResponse.error) {
        setError("Login with Microsoft failed: " + loginResponse.message);
      } else {
        navigate('/dashboard/personal');
      }
    } catch (error) {
      console.log("Microsoft login failed:", error);
      setError("Microsoft login failed.");
    }
  };
  


  const isSubmitButtonDisabled =
    isLoading || !formState.password.isValid || !formState.email.isValid;

  return (
    <div className="login-container">
      <div className="login-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-logo-container">
            <img src={logoGE} className="logoGobE" alt="Logo" />
            <div>
              <h1>Gobierno Electrónico</h1>
            </div>
          </div>
          <div className="logo-separator"></div>

          {error && <div className="error-message">{error}</div>}

          <div className="input-container">
            <Input
              field="email"
              label="Email"
              value={formState.email.value}
              onChangeHandler={handleInputValueChange}
              type="email"
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.email.showError}
              validationMessage={emailValidationMessage}
            />
          </div>

          <div className="input-container">
            <Input
              field="password"
              label="Password"
              value={formState.password.value}
              onChangeHandler={handleInputValueChange}
              type="password"
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.password.showError}
              validationMessage={passwordValidationMessage}
            />
          </div>

          <button type="submit" className="login-button" disabled={isSubmitButtonDisabled}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <button type="button" className="microsoft-login-button" onClick={loginWithMicrosoft}>
            Iniciar sesión con Microsoft
          </button>
        </form>
      </div>
    </div>
  );
};