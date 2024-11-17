import axios from "axios";

const authClient = axios.create({
  baseURL: "http://localhost:8000/auth/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default authClient;
