// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import api from "./index";

/**
 * @typedef {object} TaskDTO
 * @property {string} id
 * @property {string} name
 * @property {string=} description
 * @property {string} createdAt
 * @property {string} createdBy
 * @property {number=} priority
 * @property {string=} expiresAt
 * @property {"OPENED", "IN_PROGRESS", "FINISHED"} status
 * @property {string} responsible
 */

/**
 * Loads the information of a single task based on its identifier.
 *
 * @param {string} boardId Unique identifier of the board
 * @param {string} username Unique identifier of task
 * @returns {Promise<AxiosResponse<TaskDTO>>} Returns the API response
 */
export const fetchTask = (boardId, taskId) => {
  return api.get(`/boards/${boardId}/tasks/${taskId}`);
};

/**
 * Loads the information of all tasks for a specific board.
 *
 * @param {string} boardId Unique identifier of the board
 * @returns {Promise<AxiosResponse<TaskDTO[]>>} Returns the API response
 */
export const fetchTasks = (boardId) => {
  return api.get(`/boards/${boardId}/tasks`);
};

/**
 * Deletes an existing task by its identifier.
 *
 * @param {string} boardId Unique identifier of the board
 * @param {string} taskId Unique identifier of task
 * @returns {Promise<AxiosResponse<void>>} Returns the API response
 */
export const deleteTask = (boardId, taskId) => {
  return api.delete(`/boards/${boardId}/tasks/${taskId}`);
};

/**
 * Create a new task.
 *
 * @param {string} boardId Unique identifier of the board
 * @param {{name: string, description: string|undefined, priority: number|undefined, expiresAt: string|undefined}} data Fields of the new task to be created
 * @returns {Promise<AxiosResponse<void>>} Returns the API response
 */
export const createTask = (boardId, data) => {
  return api.post(`/boards/${boardId}/tasks`, data);
};
