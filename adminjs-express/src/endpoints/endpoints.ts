import axiosLibrary from 'axios';

import { ADMIN_BASE_URL, API_BACKEND_BASE_URL } from '../constants.js';
import { AdminQueueEndpoints } from './admin-queue/admin-queue.endpoints.js';

class Endpoints {
  constructor(apiBaseUrl: string, adminBaseUrl: string) {
    const apiAxios = axiosLibrary.create({
      baseURL: apiBaseUrl,
    });
    const adminAxios = axiosLibrary.create({
      baseURL: adminBaseUrl,
    });

    this.adminQueue = new AdminQueueEndpoints(adminAxios, '/admin/api/resources');
  }

  adminQueue: AdminQueueEndpoints;
}

export const endpoints = new Endpoints(API_BACKEND_BASE_URL, ADMIN_BASE_URL);
