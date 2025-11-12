import { apiClient } from '../api';
import type { ApiResponse, AttackData } from '../types';
import type { ModelLogIn, ModelLogInRespone, ModelResetPassRequst, ModelUser, ModelVerifyPassRequest } from './../types/model.auth';

export const loginAuth = async (
  login: ModelLogIn
) : Promise<ApiResponse<ModelLogInRespone>> => {
    const res = await apiClient.post<ApiResponse<ModelLogInRespone>>('/auth/login', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

export const registerAuth = async (
  user: ModelUser
) : Promise<ApiResponse<ModelUser>> => {
    const res = await apiClient.post<ApiResponse<ModelUser>>('/auth/register', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

//เทส execute ไม่ได้ มั่วอยู่
export const resetPassword = async (
  password: ModelResetPassRequst
) : Promise<ApiResponse<ModelResetPassRequst>> => {
    const res = await apiClient.post<ApiResponse<ModelResetPassRequst>>('/auth/reset-password', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

//เทส execute ไม่ได้ มั่วอยู่
export const resetPasswordVerify = async (
  password: ModelVerifyPassRequest
) : Promise<ApiResponse<ModelVerifyPassRequest>> => {
    const res = await apiClient.post<ApiResponse<ModelVerifyPassRequest>>('/auth/reset-password/verify', {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};

//เทส execute ไม่ได้ มั่วอยู่
export const issueTokenEmailVerify = async (
  email: string
) : Promise<ApiResponse<ModelVerifyPassRequest>> => {
    const res = await apiClient.post<ApiResponse<ModelVerifyPassRequest>>(`/auth/reset-password/${email}/issue-token`, {
        headers : {
            "Authorization": "sample",
        },
    });
    return res.data;
};
