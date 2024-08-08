import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.volleyball.ch/indoor'
});

export default api;