import { IUsers } from "@/interfaces/IUser";
import { AuthConstants } from "./authConstants";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";

export class AuthUtils {
  public static armazenarToken(authToken: string): void {
    localStorage.setItem(AuthConstants.ACCESS_TOKEN, authToken);
  }

  public static getToken(): string | null {
    return localStorage.getItem(AuthConstants.ACCESS_TOKEN);
  }

  public static armazenarAccessUser(user: IUsers): void {
    localStorage.setItem(AuthConstants.ACCESS_USER, JSON.stringify(user));
  }

  public static getAccessUser(): IUsers | null {
    const userData = localStorage.getItem(AuthConstants.ACCESS_USER);
    return userData ? (JSON.parse(userData) as IUsers) : null;
  }

  public static armazenarLoggedUserType(type: string): void {
    localStorage.setItem(AuthConstants.LOGGED_USER_TYPE, JSON.stringify(type));
  }

  public static getLoggedUserType(): string | undefined {
    return localStorage
      .getItem(AuthConstants.LOGGED_USER_TYPE)
      ?.replace(/"/g, "");
  }

  public static verifyLoggedUserIsAdmin(): boolean {
    return this.getLoggedUserType() === UsersTypeEnum.Administrador;
  }

  public static verifyLoggedUserIsProfessor(): boolean {
    return this.getLoggedUserType() === UsersTypeEnum.Professor;
  }

  public static verifyLoggedUserIsAluno(): boolean {
    return this.getLoggedUserType() === UsersTypeEnum.Aluno;
  }
}
