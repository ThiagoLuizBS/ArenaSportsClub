import http from "./http-common.js";

class PrevisionDataService {
  getPrevision(data) {
    return http.post(`/prevision`, data);
  }
}

// eslint-disable-next-line
export default new PrevisionDataService();
