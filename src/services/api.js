import axios from 'axios';

const API_URL = '/api';

// Create Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const auth = {
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    login: async (userData) => {
        const response = await api.post('/auth/login', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
};

const roadmap = {
    generate: async (data) => {
        const response = await api.post('/roadmap/generate', data);
        return response.data;
    },
    get: async () => {
        const response = await api.get('/roadmap');
        return response.data;
    },
    updateProgress: async (data) => {
        const response = await api.put('/roadmap/progress', data);
        return response.data;
    }
};

const buddy = {
    chat: async (message) => {
        const response = await api.post('/buddy/chat', { message });
        return response.data;
    }
};

// Direct axios methods for simpler usage in TodoPage (or could wrap them)
const get = async (url) => (await api.get(url)).data;
const post = async (url, data) => (await api.post(url, data)).data;
const put = async (url, data) => (await api.put(url, data)).data;
const del = async (url) => (await api.delete(url)).data;

export default {
    auth,
    roadmap,
    buddy,
    get,
    post,
    put,
    delete: del
};
