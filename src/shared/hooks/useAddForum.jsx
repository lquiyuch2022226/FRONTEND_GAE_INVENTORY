import { useState } from 'react';
import { createForum } from '../../services/api';

export const useAddForum = () => {
    const [error, setError] = useState(null);

    const addForum = async(title, type) => {
        try{
            const result = await createForum({ title, type });
            if(result.error) {
                setError(result.message);
            }else{
                return result;
            }
        }catch(e) {
            setError('An error occurred while adding the forum.');
        }
    };

    return { addForum, error };
};