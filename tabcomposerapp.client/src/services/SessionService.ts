import { IUser } from "../models/UserModel";
import { SerializationService } from "./SerializationService";

export class SessionService {

    private static readonly tokenKey = "userToken";
    private static readonly userKey = "userData";

    public static setJWT(token: string, sessionOnly: boolean) {
        if (sessionOnly) {
            sessionStorage.setItem(this.tokenKey, token);
        } else {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    public static getJWT(): string | null {
        return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
    }

    public static removeJWT(): void {
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenKey);
    }

    public static setUser(user: IUser, sessionOnly: boolean) {
        const userData = SerializationService.serializeUser(user);
        if (sessionOnly) {
            sessionStorage.setItem(this.userKey, userData);
        } else {
            localStorage.setItem(this.userKey, userData);
        }
    }

    public static updateUser(user: IUser): boolean {
        const userData = SerializationService.serializeUser(user);

        const isInLocalStorage = localStorage.getItem(this.userKey) != null;
        const isInSessionStorage = sessionStorage.getItem(this.userKey) != null;

        if (isInLocalStorage || isInSessionStorage) {
            if (isInLocalStorage) {
                localStorage.setItem(this.userKey, userData);
            }
            if (isInSessionStorage) {
                sessionStorage.setItem(this.userKey, userData);
            }
            return true;
        }

        return false;
    }

    public static getUser(): IUser | null {
        const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
        if (!userData) {
            return null;
        }
        const user: IUser = SerializationService.deserializeUser(userData);
        return user;
    }

    public static removeUser(): void {
        localStorage.removeItem(this.userKey);
        sessionStorage.removeItem(this.userKey);
    }
}