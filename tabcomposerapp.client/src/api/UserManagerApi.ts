import { isAxiosError } from "axios";
import { IUser, User } from "../models/UserModel";
import { SessionService } from "../services/SessionService";
import { AppErrors } from "../models/AppErrorsModel";
import { ClientApi, IClientApi, IClientAuth } from "./ClientApi";
export class UserManagerApi {

    //private user: User | null;

    private errors: AppErrors | null;

    private clientApi: IClientApi;
    
    constructor() {
        this.clientApi = ClientApi.getInstance();
        this.errors = null;
        //this.user = null;
    }

    public async signIn(username: string, password: string, remember: boolean): Promise<boolean> {
        this.clearErrors();
        try {
            const response = await this.clientApi.use().post('/auth/signin', {
                username,
                password
            });
            const token: string = response.data.token;

            if (!token) {
                return false;
            }
            SessionService.setJWT(token, remember);
            const profile = await this.getUserProfile();
            const user: IUser = new User(profile.userName, profile.email);
            SessionService.setUser(user, remember);
            this.clientApi.setAuthorize(true);
            return true;
        } catch (error) {
            this.errors = this.apiErrorFormatter(error, { message: "message" })
            this.signOut();
            return false;
        }
    }

    public async signUp(email: string, username: string, password: string): Promise<boolean> {
        this.clearErrors();
        try {
            await await this.clientApi.use().post('/auth/signup', {
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

    public signOut(): void {
        SessionService.removeJWT();
        SessionService.removeUser();
        this.clientApi.setAuthorize(false);
    }

    public async authorize(): Promise<boolean> {
        try {
            const token = SessionService.getJWT();
            await this.clientApi.use().get('/auth/authorize', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } catch {
            return false;
        }
    }

    public getAuth(): IClientAuth {
        return this.clientApi;
    }

    public getUserToken(): string | null {
        return SessionService.getJWT();
    }

    public async getUserTokenWithAuth(): Promise<string | null> {
        const auth = await this.authorize(); 
        if (auth) {
            return SessionService.getJWT();
        } else {
            return null;
        }
    }

    public getUser(): IUser | null {
        return SessionService.getUser();
    }

    public async downloadUser(): Promise<IUser | null> {
        try {
            const profile = await this.getUserProfile();
            const user: IUser = new User(profile.userName, profile.email);
            if (!SessionService.updateUser(user))
                return null
            return user;
        } catch {
            return null;
        }
    }

    public getErrors(): AppErrors | null {
        return this.errors;
    }
    private clearErrors(): void {
        this.errors = null;
    }

    private async getUserProfile() {
        const token = SessionService.getJWT();
        const response = await this.clientApi.use().get('/account', {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data;
    }

    private apiErrorFormatter(error: unknown, keywords: { [key: string]: string }): AppErrors {
        const formattedErrors: AppErrors = {};

        if (isAxiosError(error) && error.response) {
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