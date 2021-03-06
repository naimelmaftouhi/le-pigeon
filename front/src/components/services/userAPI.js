import axios from "axios";
import { USER_URL, USERS_URL, ADMIN_URL } from "../../config";

async function getUser() {
  const token = window.localStorage.getItem("authToken");
  return await axios.get(USER_URL).then((response) => response.data);
}

function getProfileUser(id) {
  return axios.get(USERS_URL + `/${id}`).then((response) => response.data);
}

function getProfileAgent(id) {
  return axios
    .get(USERS_URL + "/profile/agent/" + id)
    .then((response) => response.data);
}

function getDestinationByUser(id, destinationId) {
  return axios
    .get(USERS_URL + "/" + id + "/destination/" + destinationId)
    .then((response) => response.data);
}

function getRoleUser() {
  return axios.get(USERS_URL + "/me/roles").then((response) => response.data);
}

function editProfileAgent(id, data) {
  return axios
    .put(USERS_URL + "/agent/" + id, data)
    .then((response) => response.data);
}

function getUsers() {
  return axios.get(USERS_URL).then((response) => response.data);
}

function createUser(user) {
  return axios
    .post(USERS_URL, user)
    .then((response) => response.status)
    .then((status) => {
      if (status === 200) {
        return true;
      }
    });
}

function getBestAgents() {
  return axios
    .get(USERS_URL + "/agents/best")
    .then((response) => response.data);
}

function getPublicProfileAgent(id) {
  return axios
    .get(USERS_URL + "/agent/" + id + "/public")
    .then((response) => response.data);
}

function getInfoUser(id) {
  return axios
    .get(USERS_URL + "/profile/user/" + id)
    .then((response) => response.data);
}

function editProfileUser(id, data) {
  return axios
    .put(USERS_URL + "/user/" + id, data)
    .then((response) => response.data);
}

function deleteUser(id) {
  return axios.delete(USERS_URL + `/${id}`).then((response) => response.data);
}

function getRoleByUserID(id) {
  return axios.get(USERS_URL + "/role/" + id).then((response) => response.data);
}

function setRoleAdminByUserID(id) {
  return axios.put(USERS_URL + "/role/" + id).then((response) => response.data);
}

function getRecentSales() {
  return axios
    .get(USERS_URL + "/sales/recent")
    .then((response) => response.data);
}

function getRecentOrders() {
  return axios
    .get(USERS_URL + "/orders/recent")
    .then((response) => response.data);
}

function isAdmin() {
  const token = window.localStorage.getItem("authToken");
  const adminPromise = new Promise((resolve, reject) => {
    resolve(false);
  });
  if (!token) return adminPromise;
  return axios
    .get(USERS_URL + "/me/admin")
    .then((response) => response.data)
    .then((data) => {
      return Boolean(data.length);
    })
    .catch((error) => {
      return false;
    });
}
function becomeAgent() {
  return axios
    .get(USERS_URL + "/become/agent")
    .then((response) => response.data);
}
/**
 * Every times refresh page, verify if a token, if a token => set request header
 */
export default {
  getUser,
  getUsers,
  createUser,
  getProfileAgent,
  getDestinationByUser,
  getRoleUser,
  editProfileAgent,
  getBestAgents,
  getPublicProfileAgent,
  getProfileUser,
  getInfoUser,
  editProfileUser,
  deleteUser,
  getRoleByUserID,
  setRoleAdminByUserID,
  getRecentSales,
  getRecentOrders,
  isAdmin,
  becomeAgent,
};
