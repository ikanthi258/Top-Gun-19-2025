/**
 * API functions สำหรับดึงข้อมูลการตรวจจับ
 */

import type { DetectionResponse } from '../types';
import { apiClient } from './axios';

// ดึงข้อมูลการตรวจจับล่าสุดจากกล้อง
// URL: GET /object-detection/{camId}
export const getRecentDetections = async (
  camId: string,
  token: string
): Promise<DetectionResponse> => {
  const response = await apiClient.get(`/object-detection/${camId}`, {
    headers: {
      'x-camera-token': token,  // Authentication token
    },
  });

  return response.data;
};
