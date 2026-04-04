// Import Axios
import axios from "axios";

const Api = axios.create({
  // Set default endpoint API
  // baseURL: "http://127.0.0.1:8000/api/v1",
  baseURL: "https://tarkam-api-web-production.up.railway.app/api/v1",
});

export default Api;
