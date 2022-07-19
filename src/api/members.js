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
 * @param {string} boardId Unique identifier of the board
 * @param {string} username Unique username of member
 * @returns {Promise<AxiosResponse<MemberDTO>>} Returns the API response
 */
export const fetchMember = (boardId, username) => {
  return api.get(`/boards/${boardId}/members/${username}`);
};

/**
 * Loads the information of all board members for a specific board.
 *
 * @param {string} boardId Unique identifier of the board
 * @returns {Promise<AxiosResponse<MemberDTO[]>>} Returns the API response
 */
export const fetchMembers = (boardId) => {
  return api.get(`/boards/${boardId}/members`);
};

/**
 * Loads the information of a single board member based on its username.
 *
 * @param {string} boardId Unique identifier of the board
 * @param {{username: string, role: string}} data Fields of the member to be created
 * @returns {Promise<AxiosResponse<MemberDTO>>} Returns the API response
 */
export const createMember = (boardId, data) => {
  return api.post(`/boards/${boardId}/members`, data);
};
