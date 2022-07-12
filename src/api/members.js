// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import api from "./index";

/**
 * @typedef {object} MemberDTO
 * @property {string} username
 * @property {string} role
 */

/**
 * Loads the information of a single board member based on its username.
 *
 * @param {string} id Unique identifier of the board
 * @param {string} username Unique username of member
 * @returns {Promise<AxiosResponse<MemberDTO>>} Returns the API response
 */
export const fetchMember = (id, username) => {
  return api.get(`/boards/${id}/members/${username}`);
};

/**
 * Loads the information of all board members for a specific board.
 *
 * @param {string} id Unique identifier of the board
 * @returns {Promise<AxiosResponse<MemberDTO[]>>} Returns the API response
 */
export const fetchMembers = (id) => {
  return api.get(`/boards/${id}/members`);
};
