export class SessionService {

    private static readonly tokenKey = "userToken";

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

    public static isLogged(): boolean {
        const token = this.getJWT();
        if (!token)
            return false;


    }
}