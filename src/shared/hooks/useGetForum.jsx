import { useState, useEffect } from "react";
import { getForo } from "../../services/api";

export const useGetForum = (forumId) => {
    const [forum, setForum] = useState(null);
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState(null)

    useEffect(() => {

        const fetchForum = async () => {

            const result = await getForo(forumId);

            if(result.error){
                setError(result.message);
            }else{
                setForum(result.forum);
            }

            setLoading(false);

        };

        fetchForum();
    }, [forumId]);

    console.log(forum)
    console.log('Forum title:', forum ? forum.title : 'No forum object');

    return { forum, loading, error };

}

export default useGetForum;