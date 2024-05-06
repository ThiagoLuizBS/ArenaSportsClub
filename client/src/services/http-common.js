import axios from "axios";

export default axios.create({
  baseURL: "https://api.arenasportclub.site/api/v1/football",
  // baseURL: "http://localhost:5000/api/v1/football",
  headers: {
    "Content-type": "application/json",
  },
});
