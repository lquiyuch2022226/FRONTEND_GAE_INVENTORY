import { useState, useEffect } from "react";
import { getPosts as getPostsRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPosts = async () => {
    setIsLoading(true);

    const response = await getPostsRequest();

    setIsLoading(false);
    if (response.error) {
      setError(response.e);
      return toast.error(
        response.e?.response?.data || 'Error al cargar los posts'
      );
    }

    setPosts(response.data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return {
    posts,
    isLoading,
    error
  };
};