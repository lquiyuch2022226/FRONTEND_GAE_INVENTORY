import { useState } from 'react';
import { useAddComment } from '../../services/api'; 

export const useAddCommentForo = () => {
    const [error, setError] = useState(null);

    const addComment = async (title, username, text, setForum) => {
        try{
            const result = await useAddComment(title, username, text);

            if(result.error){
                setError(result.message);
            }else{
                setForum(prevForum => ({
                    ...prevForum,
                    comentaries: [...prevForum.comentaries, {
                        user: username,
                        text: text,
                        fecha: new Date()
                    }]
                }));
            }
        }catch(e){
            setError(e.message);
        }
    };

    return { addComment, error };
};
