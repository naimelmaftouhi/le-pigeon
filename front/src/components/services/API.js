import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
    request => {
        console.log(request);
        // Edit request config
        return request;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        console.log(response);
        // Edit response config
        return response;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);