// Import Axios
import axios from "axios";

const Api = axios.create({
  // Set default endpoint API
  // baseURL: "https://tarkam-api.sintekp.com/api/v1",
  // baseURL: "http://127.0.0.1:8000/api/v1",
  baseURL: "https://tarkam-api.primatechindo.com/api/v1",
});

export default Api;
