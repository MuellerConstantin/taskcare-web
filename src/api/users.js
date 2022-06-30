// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import api from "./index";

/**
 * @typedef {object} UserDTO
 * @property {string} username
 * @property {string} email
 * @property {string=} firstName
 * @property {string=} lastName
 */

/**
 * @typedef {object} UserPageDTO
 * @property {[UserDTO]} content
 * @property {number} perPage
 * @property {number} page
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * Create a new user account.
 *
 * @param {{username: string, email: string, password: string}} data Fields of the new account to be created
 * @returns {Promise<AxiosResponse<UserDTO>>} Returns the API response
 */
// eslint-disable-next-line import/prefer-default-export
export const createUser = (data) => {
  return api.post("/users", data);
};
