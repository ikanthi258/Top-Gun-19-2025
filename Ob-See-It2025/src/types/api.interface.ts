export interface ClearDataResponse {
  success: boolean;
  message: string;
}

export interface RegenerateTokenResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface ApiResponse<T> {
  success : boolean;
  data: T;
}