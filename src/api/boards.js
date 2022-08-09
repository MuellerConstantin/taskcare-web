// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import api from "./index";

/**
 * @typedef {object} BoardDTO
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} createdAt
 * @property {string} createdBy
 */

/**
 * @typedef {object} BoardPageDTO
 * @property {[BoardDTO]} content
 * @property {number} perPage
 * @property {number} page
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * Loads the meta information of all available boards.
 * The resource is loaded paged.
 *
 * @param {string} username Name of user to fetch boards for
 * @param {number} page Zero based index of the page to load
 * @returns {Promise<AxiosResponse<BoardPageDTO>>} Returns the API response
 */
export const fetchBoardsByMembership = (username, page) => {
  return api.get(`/users/${username}/boards`, {
    params: { page },
  });
};

/**
 * Loads the information of a single board based on its id.
 *
 * @param {string} id Unique identifier of the resource
 * @returns {Promise<AxiosResponse<BoardDTO>>} Returns the API response
 */
export const fetchBoard = (id) => {
  return api.get(`/boards/${id}`);
};

/**
 * Create a new board.
 *
 * @param {{name: string, description: string}} data Fields of the new board to be created
 * @returns {Promise<AxiosResponse<void>>} Returns the API response
 */
export const createBoard = (data) => {
  return api.post("/boards", data);
};

/**
 * Update an existing board by its identifier.
 *
 * @param {string} id Unique identifier of the resource
 * @param {{name: string|undefined, description: string|undefined}} data Fields of the board to be updated
 * @returns {Promise<AxiosResponse<void>>} Returns the API response
 */
export const updateBoard = (id, data) => {
  return api.patch(`/boards/${id}`, data);
};

/**
 * Deletes an existing board by its identifier.
 *
 * @param {string} id Unique identifier of the resource
 * @returns {Promise<AxiosResponse<void>>} Returns the API response
 */
export const deleteBoard = (id) => {
  return api.delete(`/boards/${id}`);
};
