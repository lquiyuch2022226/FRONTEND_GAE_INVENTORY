import { useState } from "react";
import { createPost as createPostRequest } from "../../services/api";
import toast from "react-hot-toast";

export const usePost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (data) => {
    setIsLoading(true);

    const response = await createPostRequest(data);

    setIsLoading(false);
    if (response.error) {
      return toast.error(
        response.e?.response?.data || 'Error al crear el post'
      );
    }

    toast.success('Post creado exitosamente');
  };

  return {
    createPost,
    isLoading
  };
};
