import { IUsers } from "@/interfaces/IUser";
import { AuthConstants } from "./authConstants";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";
import { jwtDecode } from "jwt-decode";

export class AuthUtils {
  public static temTokenValido(): boolean {
    const token = localStorage.getItem(AuthConstants.ACCESS_TOKEN);

    if (!token) {
      return false;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000; // Convertendo para segundos

      return decodedToken.exp > now;
    } catch (error) {
      return false;
    }
  }

  public static armazenarToken(authToken: string): void {
    localStorage.setItem(AuthConstants.ACCESS_TOKEN, authToken);
  }

  public static getToken(): string | null {
    return localStorage.getItem(AuthConstants.ACCESS_TOKEN);
  }

  public static armazenarRefreshToken(refreshTken: string): void {
    localStorage.setItem(AuthConstants.REFRESH_TOKEN, refreshTken);
  }

  public static getRefreshToken(): string | null {
    return localStorage.getItem(AuthConstants.REFRESH_TOKEN);
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

  public static logout(): void {
    localStorage.removeItem(AuthConstants.ACCESS_TOKEN);
    localStorage.removeItem(AuthConstants.REFRESH_TOKEN);
    localStorage.removeItem(AuthConstants.ACCESS_USER);
    localStorage.removeItem(AuthConstants.LOGGED_USER_TYPE);
  }
}
