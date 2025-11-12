import { apiClient } from "../api";
import type {
  CameraResponse,
  ClearDataResponse,
  DetectedObject,
  DetectionEventsResponse,
  ModelAttack,
  ObjectDetectionResponse,
  RegenerateTokenResponse,
} from "../types";

// ==================== Interfaces ====================

// ==================== API Functions ====================

/**
 * 1. ดึงข้อมูลกล้องด้วย cam_id
 * GET /cameras/{cam_id}
 */
export const getCameraById = async (
  camId: string,
  cameraToken: string
): Promise<CameraResponse> => {
  const response = await apiClient.get<CameraResponse>(`/object-detection/info/${camId}`, {
    headers: {
      "x-camera-token": cameraToken,
    },
  });
  return response.data;
};

/**
 * 2. ดึงข้อมูล detection events ย้อนหลัง 24 ชั่วโมง
 * GET /cameras/{cam_id}/detections
 */
export const getDetectionEvents = async (
  camId: string,
  cameraToken: string
): Promise<ModelAttack> => {
  const response = await apiClient.get<ModelAttack>(
    `/v1/attack`,
    {
      headers: {
        "authentication": cameraToken,
      },
    }
  );
  return response.data;
};

export const sendObjectDetection = async (
  camId: string,
  cameraToken: string,
  image: File,
  objects: DetectedObject[],
  timestamp: string
): Promise<ObjectDetectionResponse> => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("objects", JSON.stringify(objects));
  formData.append("timestamp", timestamp);

  const response = await apiClient.post<ObjectDetectionResponse>(
    `/object-detection/${camId}`,
    formData,
    {
      headers: {
        "x-camera-token": cameraToken,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * 4. ลบข้อมูล detection events, detected objects และรูปภาพทั้งหมดของกล้อง
 * DELETE /object-detection/clear/${camId}
 */
export const clearCameraData = async (
  camId: string,
  cameraToken: string
): Promise<ClearDataResponse> => {
  const response = await apiClient.delete<ClearDataResponse>(
    `/object-detection/clear/${camId}`,
    {
      headers: {
        "x-camera-token": cameraToken,
      },
    }
  );
  return response.data;
};

/**
 * 5. สร้าง token ใหม่สำหรับกล้อง (ต้องใช้ token เดิมที่ยังใช้งานได้)
 * POST `/object-detection/token/${camId}
 */
export const regenerateToken = async (
  camId: string,
  cameraToken: string
): Promise<RegenerateTokenResponse> => {
  const response = await apiClient.patch<RegenerateTokenResponse>(
    `/object-detection/token/${camId}`,
    {
      headers: {
        "x-camera-token": cameraToken,
      },
      token : cameraToken
    }
  );
  return response.data;
};

/**
 * 6. ดึงไฟล์รูปภาพที่อัพโหลดไว้ด้วย camera ID และชื่อไฟล์
 * GET /files/${cameraId}/${fileName}
 * @returns Blob ของไฟล์รูปภาพ
 */
export const getUploadedFile = async (
  camId: string,
  cameraToken: string,
  filename: string
): Promise<Blob> => {
  const response = await apiClient.get(`/files/${camId}/${filename}`, {
    headers: {
      "x-camera-token": cameraToken,
    },
    responseType: "blob", // สำคัญ: ระบุให้ response เป็น blob
  });
  return response.data;
};

/**
 * Helper function: แปลง Blob เป็น URL สำหรับแสดงรูปภาพ
 * @param blob - Blob ที่ได้จาก getUploadedFile
 * @returns URL สำหรับใช้กับ <img src={url} />
 */
export const createImageUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

/**
 * Helper function: ดาวน์โหลดไฟล์
 * @param blob - Blob ที่ได้จาก getUploadedFile
 * @param filename - ชื่อไฟล์ที่ต้องการบันทึก
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


