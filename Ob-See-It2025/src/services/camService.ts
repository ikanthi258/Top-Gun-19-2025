import { apiClient } from "../api";
import type { ApiResponse, Camera, ModelVerifyPassRequest } from "../types";

export const getCamera = async (
  page: number, per_page: number, keyword: string, column: string
) : Promise<ApiResponse<Camera>> => {
    const res = await apiClient.post<ApiResponse<Camera>>(`/camera`, {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

