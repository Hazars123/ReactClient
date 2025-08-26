import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3001/api/"

//simple request sans header
export function getAxiosInstance() {
if (axios === null) {
axios.create({
baseURL: axios.defaults.baseURL,
});
}
}
// Add a request interceptor

axios.interceptors.request.use(
config => {
const token=localStorage.getItem("CC_Token");
if (token) {
config.headers['Authorization'] = 'Bearer ' + token;
}
return config;
},
error => {
Promise.reject(error)
});
export default axios;