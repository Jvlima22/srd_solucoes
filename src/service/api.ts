import axios from "axios";

const api = axios.create({
  baseURL: "https://srd-solucoes.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Add any custom logic before the request is sent
    console.log("Request  made with ", config);
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request
    console.log("Request error: ", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    // Handle the response data
    console.log("Response received: ", response);
    return response;
  },
  (error) => {
    // Handle any errors that occur during the response
    console.log("Response error: ", error);
    return Promise.reject(error);
  },
);

export { api };
