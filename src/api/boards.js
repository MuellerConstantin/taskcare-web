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
 * @param {number} page Zero based index of the page to load
 * @returns {Promise<AxiosResponse<BoardPageDTO>>} Returns the API response
 */
// eslint-disable-next-line import/prefer-default-export
export const fetchBoardsByMembership = (username, page) => {
  return api.get(`/users/${username}/boards`, {
    params: { page },
  });
};
