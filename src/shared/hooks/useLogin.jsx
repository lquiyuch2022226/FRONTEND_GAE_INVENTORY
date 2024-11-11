/* import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login as loginRequest } from "../../services/api"
import toast from "react-hot-toast"

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const login = async (microsoftToken) => {
        setIsLoading(true);
    
        try {
            const response = await loginRequest(microsoftToken);
    
            if (response.error) {
                const errorMessage = response.e?.response?.data?.msg || 'Ocurrió un error al iniciar sesión';
                toast.error(errorMessage);
            } else {
                // Asegúrate de acceder a accessToken
                const { accessToken } = response; // Cambia aquí
                localStorage.setItem('token', accessToken); // Guarda el token
                navigate('/dashboard/personal');
            }
        } catch (error) {
            console.error("Error en el login:", error);
            toast.error("Ocurrió un error al iniciar sesión");
        } finally {
            setIsLoading(false); // Asegúrate de que esto se ejecute siempre
        }
    };
    
    return {
        login,
        isLoading
    }
}
 */