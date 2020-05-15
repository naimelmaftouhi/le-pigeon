import axios from "axios";
import { USER_URL, USERS_URL } from "../../config";

function getUser() {
  return axios.get(USER_URL).then((response) => response.data);
}
function getProfileAgent(id) {
  return axios
    .get(USERS_URL + "/profile/agent/" + id)
    .then((response) => response.data);
}
function getAvgRatings(id) {
  return axios
    .get(USERS_URL + "/profile/agent/" + id + "/avgratings")
    .then((response) => response.data);
}
function getCommentsByAgent(id) {
  return axios
    .get(USERS_URL + "/" + id + "/comments")
    .then((response) => response.data);
}
function getDestinationByUser(id, destinationId) {
  return axios
    .get(USERS_URL + "/" + id + "/destination/" + destinationId)
    .then((response) => response.data);
}

export default {
  getUser,
  getProfileAgent,
  getAvgRatings,
  getDestinationByUser,
  getCommentsByAgent,
};
