// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import api from "./index";

/**
 * @typedef {object} TokenDTO
 * @property {"Bearer"} type
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} accessExpiresIn
 * @property {number} refreshExpiresIn
 * @property {string} principle
 */

/**
 * @typedef {object} TicketDTO
 * @property {string} ticket
 * @property {number} expiresIn
 * @property {string} principle
 */

/**
 * @typedef {object} PrincipalDTO
 * @property {string} username
 * @property {string} email
 * @property {string=} firstName
 * @property {string=} lastName
 */

/**
 * Generates an access token on the server side.
 *
 * @param {string} username Name of user to generate token for
 * @param {string} password Account password
 * @returns {Promise<AxiosResponse<TokenDTO>>} Returns the API response
 */
export const generateToken = (username, password) => {
  return api.post("/auth/token", {
    username,
    password,
  });
};

/**
 * Loads the information of the current authenticated user.
 *
 * @returns {Promise<AxiosResponse<PrincipalDTO>>} Returns the API response
 */
export const fetchPrincipal = () => {
  return api.get("/auth/user");
};

/**
 * Refresh an access token on the server side.
 *
 * @param {string} token The refresh token to use
 * @returns {Promise<AxiosResponse<TokenDTO>>} Returns the API response
 */
export const refreshToken = (token) => {
  return api.post("/auth/refresh", {
    refreshToken: token,
  });
};

/**
 * Generates a ticket on the server side.
 *
 * @returns {Promise<AxiosResponse<TicketDTO>>} Returns the API response
 */
export const generateTicket = () => {
  return api.post("/auth/ticket");
};
