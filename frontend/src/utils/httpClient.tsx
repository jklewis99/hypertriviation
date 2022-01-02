import axios from "axios"
import camelCaseKeys from "camelcase-keys"
import { useNavigate } from 'react-router-dom';

const httpClient = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  timeout: 30000,
  headers: {
    'Authorization': "Bearer " + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})
// httpClient.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// httpClient.defaults.baseURL = "http://127.0.0.1:8000/"
httpClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return {
      ...response,
      data: camelCaseKeys(response.data, { deep: true }),
    }
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
      // if (originalRequest._retry) {
      //   debugger;
      //   useNavigate()("http://localhost:3000/user"); // TODO: change this
      // }
      const refreshToken = localStorage.getItem('refreshToken');
      originalRequest._retry = true;
      return httpClient
        .post('authapi/token/refresh/', { refresh: refreshToken })
        .then((response) => {
          // debugger;
          localStorage.setItem('accessToken', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);

          httpClient.defaults.headers.common['Authorization'] = "Bearer " + response.data.access;
          originalRequest.headers['Authorization'] = "Bearer " + response.data.access;

          return httpClient(originalRequest);
        })
        .catch(err => {
          console.log(err)
        });
    }
    return Promise.reject(error)
  }
);

export default httpClient