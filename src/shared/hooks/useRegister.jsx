import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const register = async (userData) => {
        setIsLoading(true);

        const response = await registerRequest(userData);

        setIsLoading(false);
        if (response.error) {
            return toast.error(
                response.e?.response?.data || 'Ocurrió un error al registrar'
            );
        }

        const { userDetails } = response.data;

        localStorage.setItem('user', JSON.stringify(userDetails));

        navigate('/');
    };
    return {
        register,
        isLoading
    };
};
