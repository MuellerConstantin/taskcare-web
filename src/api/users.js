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
export const createUser = (data) => {
  return api.post("/users", data);
};

/**
 * Update an existing user account by its identifier.
 *
 * @param {string} username Unique username of the resource
 * @param {{email: string|undefined, password: string|undefined, firstName: string|undefined, lastName: string|undefined}} data Fields of the account to be updated
 * @returns {Promise<AxiosResponse<UserDTO>>} Returns the API response
 */
export const updateUser = (username, data) => {
  return api.patch(`/users/${username}`, data);
};

/**
 * Deletes an existing user account by its identifier.
 *
 * @param {string} username Unique username of the resource
 * @returns {Promise<AxiosResponse>} Returns the API response
 */
export const deleteUser = (username) => {
  return api.delete(`/users/${username}`);
};
