import { useState } from 'react';
import { register as createUserAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const useCreateUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const createUser = async (userData) => {

        setIsLoading(true);
        try {

            console.log(userData);
            await createUserAPI(userData);
            setIsLoading(false);
            //navigate('/dashboard');
        } catch (error) {
            
            setIsLoading(false);
            console.error('User creation failed:', error);
        }
    };

    return { createUser, isLoading };
};
