export class RegisterResponse {
  id;
  email;
  nickname;
  createdAt;

  constructor(user) {
    const { id, email, nickname, createdAt } = user;
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nickname: this.nickname,
      createdAt: this.createdAt,
    };
  }
}

export class WithdrawResponse {
  email;
  deletedAt;

  constructor(user) {
    const { email, deletedAt } = user;
    this.email = email;
    this.deletedAt = deletedAt;
  }

  toJSON() {
    return {
      email: this.email,
      deletedAt: this.deletedAt,
    };
  }
}

export class LoginResponse {
  token;

  constructor(token) {
    this.token = token;
  }

  toJSON() {
    return {
      token: this.token,
    };
  }
}

export class RefreshResponse {
  token;

  constructor(token) {
    this.token = token;
  }

  toJSON() {
    return {
      token: this.token,
    };
  }
}

export class Payload {
  id;
  role;
  constructor(data) {
    const { id, role } = data;
    this.id = id;
    this.role = role;
  }

  toJSON() {
    return {
      id: this.id,
      role: this.role,
    };
  }
}
