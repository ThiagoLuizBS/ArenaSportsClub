import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:5000/api/v1/football",
  baseURL: "https://arenasportsclub-production.up.railway.app/api/v1/football",
  headers: {
    "Content-type": "application/json",
  },
});
