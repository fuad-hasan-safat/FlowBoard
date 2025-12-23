import axiosClient from "./axiosClient";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
}

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/auth/login", data);
  return res.data;
};
