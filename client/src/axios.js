import axios from "axios";

const axiosBase = axios.create({
    baseURL: "http://localhost:4400/api"
})

export default axiosBase