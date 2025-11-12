import { apiClient } from "../api";
import type { ApiResponse, AttackData, ModelAttack } from "../types";



export const getAttack = async (
  page : number, perPage : number, keyword : string, column : string
) : Promise<ApiResponse<ModelAttack>> => {
    const res = await apiClient.get<ApiResponse<ModelAttack>>('/attack', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

export const postAttack = async (
  attack: AttackData
) : Promise<ApiResponse<AttackData>> => {
    const res = await apiClient.post<ApiResponse<AttackData>>('/attack', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

export const getAttackId = async (
    id: number
) : Promise<ApiResponse<AttackData>> => {
    const res = await apiClient.get<ApiResponse<AttackData>>(`/attack/${id}`, {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

export const updateAttack = async (
    id: number
) : Promise<ApiResponse<AttackData>> => {
    const res = await apiClient.put<ApiResponse<AttackData>>(`/attack/${id}`, {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

export const deleteAttack = async (
    id: number
) : Promise<ApiResponse<AttackData>> => {
    const res = await apiClient.delete<ApiResponse<AttackData>>(`/attack/${id}`, {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};