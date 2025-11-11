import type { Camera } from "./camera.interface";
import type { ImageInfo } from "./image.interface";

export interface DetectionEvent {
  id: number;
  cam_id: string;
  timestamp: string;
  image_path: string;
}

export interface DetectedObject {
  class: string;
  confidence: number;
  bbox: number[];
  [key: string]: any;
}

export interface DetectionEventsResponse {
  success: boolean;
  data: DetectionEvent[];
}

export interface ObjectDetectionResponse {
  success: boolean;
  message: string;
  data: {
    cam_id: string;
    timestamp: string;
    image: ImageInfo;
  };
}

// วัตถุที่ตรวจพบแต่ละชิ้น
export interface DetectedObject {
  obj_id: string;      // รหัสประจำตัววัตถุ เช่น "obj_001"
  type: string;        // ประเภทวัตถุ เช่น "drone", "person", "car"
  lat: number;         // พิกัด Latitude
  lng: number;         // พิกัด Longitude
  objective: string;   // วัตถุประสงค์ เช่น "unknown", "our", "enemy"
  size: string;        // ขนาดวัตถุ เช่น "small", "medium", "large"
}

// เหตุการณ์การตรวจจับ
export interface DetectionEvent {
  id: number;                    // ID ของ event
  cam_id: string;                // UUID ของกล้อง
  camera: Camera;                // ข้อมูลกล้อง
  timestamp: string;             // เวลาที่ตรวจจับ (ISO 8601)
  image_path: string;            // path รูปภาพ เช่น "/uploads/images/..."
  objects: DetectedObject[];     // รายการวัตถุที่ตรวจจับได้
}

// Response จาก API
export interface DetectionResponse {
  success: boolean;              // สถานะความสำเร็จ
  data: DetectionEvent[];        // รายการ detection events
}