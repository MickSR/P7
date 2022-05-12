import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

const register = (userName, email, password) => {
  return axios.post(API_URL + "signup", {
    userName,
    email,
    password,
  });
};

const login = (userName, password) => {
  return axios
    .post(API_URL + "login", {
      userName,
      password,
    })
    .then((response) => {
      localStorage.setItem("User", JSON.stringify(response.data));
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("User");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("User"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
