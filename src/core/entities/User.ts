import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export default class User {
  readonly id: string;
  readonly password!: string;
  public email!: string;
  public status!: UserStatus;
  public balance!: number;

  constructor(
    user: Omit<User, "id" | "setPassword" | "validateUser" | "password">,
    id?: string,
    password?: string
  ) {
    Object.assign(this, user);
    this.id = id || randomUUID();
    if (password) this.password = password;
  }

  static async getHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then(resolve).catch(reject);
    });
  }

  async setPassword(password: string) {
    const hash = await User.getHash(password);
    Object.assign(this, {
      password: hash,
    });
  }

  async validateUser(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password).then(resolve).catch(reject);
    });
  }
}
