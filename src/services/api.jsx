import axios from "axios";

const apiClient = axios.create({
    baseURL: 'tp://localhost:3000' + '/GAE/v1',
    timeout: 10000
})


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Centralized error handling function
const handleError = (error) => {
    const responseStatus = error?.response?.status;
    if (responseStatus === 401 || responseStatus === 403) {
        // Handle logout or redirect if needed
        logout(); // Implement this function to handle user logout
    }
    return {
        error: true,
        message: error.response?.data?.msg || error.message,
    };
};

export const login = async (token) => {
    try {
        return await apiClient.post('/auth/login/microsoft', { token });
    } catch (error) {
        return handleError(error);
    }
};

export const register = async (data) => {
    try {
        return await apiClient.post('/auth/register', data);
    } catch (error) {
        return handleError(error);
    }
};

export const getUsers = async () => {

    try {
        const response = await apiClient.get('/user');
        return response.data.users;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const getUserProfile = async () => {

    try {
        const response = await apiClient.get('/user/profile');
        return response.data.user;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const getPatients = async () => {

    try {
        return await apiClient.get('/user/patients');
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const updatePatientProgress = async (id, data) => {

    try {
        return await apiClient.patch(`/user/patients/${id}`, data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
};

export const getSupporters = async () => {

    try {
        return await apiClient.get('/user/profesionalSupport');
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const getAllNotes = async () => {

    try {
        return await apiClient.get('/note/all');
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const getNotesByCreator = async () => {

    try {
        return await apiClient.get('/note/creator');
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const getReporteData = async () => {

    try {
        return await apiClient.get('/report/');
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const createNote = async (data) => {

    try {
        return await apiClient.post('/note/create', data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }

};

export const putUnity = async (id, data) => {

    try {
        return await apiClient.put(`/unidad/${id}`, data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
};

export const storeReporteData = async ({ listado, fecha }) => {
    try {
        const data = { listado, fecha };
        console.log(data, "data enviada en la api al backend");
        const response = await apiClient.post(`/report/reportes/store`, data);
        return response.data;
    } catch (e) {
        console.error('Error al enviar datos al backend:', e);
        return {
            error: true,
            e
        };
    }
};

export const updateUser = async (id, data) => {

    try {
        return await apiClient.put(`/user/put/${id}`, data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
};

export const updateNote = async (id, data) => {

    try {
        return await apiClient.put(`/note/update/${id}`, data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
};

export const deleteNote = async (id) => {

    try {
        return await apiClient.delete(`/note/delete/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
};

export const createPost = async (data) => {
    try {
        console.log(data);
        return await apiClient.post('/post/newPost', data);
    } catch (e) {
        console.error("Error creating post:", e.response ? e.response.data : e.message);
        return {
            error: true,
            e
        };
    }
};

export const getPosts = async () => {
    try {
        return await apiClient.get('/post/getPost');
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const createForum = async (forumData) => {
    try {
        const response = await apiClient.post('/forum', forumData);
        return response.data;
    } catch (e) {
        return { error: true, message: e.message };
    }
};

export const getForums = async () => {
    try {
        const response = await apiClient.get('/forum');
        return response.data;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

export const getForo = async (forumId) => {
    try {
        const response = await apiClient.get(`/forum/${forumId}`);
        console.log('API response data:', response.data);
        return response.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.msg || error.message
        };
    }
};

export const useAddComment = async (forumTitle, username, text) => {
    try {
        const response = await apiClient.put('/forum/addMessage', {
            title: forumTitle,
            user: username,
            text: text
        });
        return response.data;
    } catch (e) {
        return { error: true, message: e.message };
    }
};

/*-------------------------Informe de entrada de personal------------------------------*/


export const getPersonalById = async (id) => {
    try {
        return await apiClient.get(`/personal/${id}`);
        console.log('personal---', id);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUserById = async (id) => {
    try {
        return await apiClient.get(`/user/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUnityById = async (id) => {
    try {
        return await apiClient.get(`/unidad/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const generarExcel = async (listado) => {
    try {
        return await apiClient.post(`/unidad/excel`, { listado });
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};

export const getUpdatedUnitsToday = async (id) => {
    try {
        return await apiClient.get(`/unidad/obtener/UnidadesEnviadas`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUnits = async () => {
    try {
        const response = await apiClient.get('/unidad');
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
};