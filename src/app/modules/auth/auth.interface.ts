export type ILoginUser = {
  email?: string;
  password?: string;
  token?: string;
};

export type ICreateUser = {
  email: string;
  password: string;
  phone: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
