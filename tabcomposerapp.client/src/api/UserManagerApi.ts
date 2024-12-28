import axios from "axios";
import { IUser, User } from "../models/UserModel";
import { SessionService } from "../services/SessionService";
import { AppErrors } from "../models/AppErrorsModel";

export class UserManagerApi {

    private static user: User | null;

    private static errors: AppErrors | null;

    public static async signIn(username: string, password: string, remember: boolean): Promise<boolean> {
        this.clearErrors();
        try {
            const response = await axios.post('https://localhost:44366/api/auth/signin', {
                username,
                password
            });
            const token: string = response.data.token;

            if (!token) {
                return false;
            }
            SessionService.setJWT(token, remember);
            const profile = await this.getUserProfile();
            this.user = new User(profile.userName, profile.email)
            return true;
        } catch (error) {
            this.errors = this.apiErrorFormatter(error, { message: "message" })
            return false;
        }
    }

    public static async signUp(email: string, username: string, password: string): Promise<boolean> {
        this.clearErrors();
        try {
            await axios.post('https://localhost:44366/api/auth/signup', {
                email,
                username,
                password
            });
            return true;
        } catch (error) {
            this.errors = this.apiErrorFormatter(error, {
                email: "Email",
                username: "UserName",
                password: "Password",
            });
            return false;
        }
    }

    public static signOut(): void {
        SessionService.removeJWT();
        this.user = null;
    }

    public static async authorize(): Promise<boolean> {
        try {
            const token = SessionService.getJWT();
            await axios.get('https://localhost:44366/api/auth/authorize', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } catch {
            return false;
        }
    }

    public static async getUserToken(): Promise<string | null> {
        const auth = await this.authorize(); 
        if (auth) {
            return SessionService.getJWT();
        } else {
            return null;
        }
    }

    public static getUser(): IUser | null {
        return this.user;
    }

    public static async downloadUser(): Promise<IUser | null> {
        try {
            const profile = await this.getUserProfile();
            this.user = new User(profile.userName, profile.email);
            return this.user;
        } catch {
            return null;
        }
    }

    public static getErrors(): AppErrors | null {
        return this.errors;
    }
    private static clearErrors(): void {
        this.errors = null;
    }

    private static async getUserProfile() {
        const token = SessionService.getJWT();
        const response = await axios.get('https://localhost:44366/api/Account', {
            headers: {
                Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
            }
        });
        return response.data;
    }

    private static apiErrorFormatter(error: unknown, keywords: { [key: string]: string }): AppErrors {
        const formattedErrors: AppErrors = {};

        if (axios.isAxiosError(error) && error.response) {
            const serverErrors = error.response.data;
            if (Array.isArray(serverErrors)) {
                serverErrors.forEach((err: { code: string; description: string }) => {
                    let matched = false;

                    for (const [key, keyword] of Object.entries(keywords)) {
                        if (err.code.includes(keyword)) {
                            formattedErrors[key] = formattedErrors[key] || [];
                            formattedErrors[key].push(err.description);
                            matched = true;
                            break;
                        }
                    }

                    if (!matched) {
                        formattedErrors.unknown = formattedErrors.unknown || [];
                        formattedErrors.unknown.push(err.description);
                    }
                });
            } else if (typeof serverErrors === 'object' && serverErrors !== null) {

                Object.entries(serverErrors).forEach(([field, description]) => {
                    let matched = false;

                    for (const [key, keyword] of Object.entries(keywords)) {
                        if (field.includes(keyword)) {
                            formattedErrors[key] = formattedErrors[key] || [];
                            formattedErrors[key].push(description as string);
                            matched = true;
                            break;
                        }
                    }

                    if (!matched) {
                        formattedErrors.unknown = formattedErrors.unknown || [];
                        formattedErrors.unknown.push(description as string);
                    }
                });

            } else {
                formattedErrors.unknown = ['Unexpected error occurred'];
            }

        } else {
            formattedErrors.unknown = ['Unexpected error occurred'];
        }
        return formattedErrors;
    }

}