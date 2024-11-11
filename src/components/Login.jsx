import { useState, useEffect } from "react";
import logoGE from "../assets/img/SmallLogo.jpg";
import './login.css';
/* import { useLogin } from "../shared/hooks"; */
import * as msal from '@azure/msal-browser'; // Import MSAL
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const msalConfig = {
  auth: {
    clientId: '7d105d0d-94ca-4645-873d-4bd5edf190bb', // Tu clientId
    authority: 'https://login.microsoftonline.com/a00e95d9-ed09-478e-9f3a-7aa025deb516', // Tu tenant ID
    redirectUri: 'https://frontend-gae-inventory-rkmq.vercel.app/dashboard/personal', // URI de redirección
    postLogoutRedirectUri: 'https://frontend-gae-inventory-rkmq.vercel.app/', // Opcional
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export const Login = () => {
  /* const { login, isLoading } = useLogin(); */
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

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Simulación de solicitud de login con un error siempre
    const simulateLogin = () => new Promise((resolve) => {
      setTimeout(() => resolve({ error: true }), 3000); // Simula un error tras 3 segundos
    });

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: La solicitud tomó demasiado tiempo.')), 60000)
    );

    try {
      const result = await Promise.race([
        simulateLogin(),
        timeout
      ]);

      if (result.error) {
        setError("Error: no se pudo completar el inicio de sesión simulado.");
      } else {
        setError(null);
        navigate('/dashboard/personal');
      }
    } catch (error) {
      console.error(error);
      setError("La solicitud tomó demasiado tiempo o ocurrió un error.");
    }
  };

  const loginWithMicrosoft = async () => {
    const loginRequest = {
      scopes: ['openid', 'profile', 'email', 'User.Read'],
    };

    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const token = response.accessToken;

      // Obtener la información del perfil del usuario
      const profileResponse = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: response.account,
      });

      // Llamada a Microsoft Graph para obtener detalles del usuario
      const userDetailsResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userDetailsResponse.ok) {
        throw new Error("Error fetching user details");
      }

      const userDetails = await userDetailsResponse.json();

      // Llamada adicional para obtener la foto de perfil del usuario
      const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let profilePicture = null;
      if (photoResponse.ok) {
        // Convierte la respuesta en un formato de imagen (Blob)
        const photoBlob = await photoResponse.blob();
        profilePicture = URL.createObjectURL(photoBlob); // Crea una URL para la imagen
      }

      const userIP = await getUserIP();

      // Guarda los datos relevantes en localStorage, incluyendo la IP
      localStorage.setItem('datosUsuario', JSON.stringify({
        account: response.account,
        accessToken: token,
        profilePicture: profilePicture, // Aquí guardamos la imagen de perfil
        officeLocation: userDetails.officeLocation, // Almacena el officeLocation
        ipAddress: userIP, // Aquí guardamos la IP
      }));

      navigate('/dashboard/personal');
    } catch (error) {
      setError("Microsoft login failed: " + (error.message || "Unknown error"));
    }
  };

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


          <button className="uiverse" onClick={loginWithMicrosoft}>
            <div className="wrapper">
              <span>Login</span>
              <div className="circle circle-12"></div>
              <div className="circle circle-11"></div>
              <div className="circle circle-10"></div>
              <div className="circle circle-9"></div>
              <div className="circle circle-8"></div>
              <div className="circle circle-7"></div>
              <div className="circle circle-6"></div>
              <div className="circle circle-5"></div>
              <div className="circle circle-4"></div>
              <div className="circle circle-3"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-1"></div>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
