export type RegisterRequest = {
  body: RegisterBody;
};

export type loginRequest = {
  body: LoginBody;
};

export type RegisterBody = {
  email: string;
  password: string;
  nickname: string;
};

export type LoginBody = {
  email: string;
  password: string;
};
