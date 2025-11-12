export interface ModelLogIn {
  email: string;
  password: string;
}

export interface ModelResetPassRequst {
  new_password: string;
  old_password: string;
}

export interface ModelUser {
  email: string;
  first_name: string;
  first_name_en: string;
  last_name: string;
  last_name_en: string;
  password: string;
  title: string;
  title_en: string;
  create_at?: Date;
  update_at?: Date;
  delete_at?: null;
}

export interface ModelLogInRespone {
  token: string;
  user: ModelUser;
}

export interface ModelVerifyPassRequest {
    password: string;
    token: string;
}