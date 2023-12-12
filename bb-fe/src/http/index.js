import axios from 'axios';
import { get } from 'svelte/store';
import { user } from '$stores/user.js';
const test = false;
class AxiosWrapper {
    constructor() {
        this.axios = axios.create({
            baseURL: test ? 'http://localhost:3000/api' : 'https://birminghambling.developyn.com/api'
        });
        this.axios.interceptors.request.use(config => {
            if (config.url.includes('/admin')) config.headers.Authorization = `Bearer ${get(user).access_token}`;
            return config;
        }, error => console.log(error));
    }
}

const http = new AxiosWrapper();

export default http;