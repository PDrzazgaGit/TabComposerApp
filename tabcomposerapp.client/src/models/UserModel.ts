export interface IUser {
    readonly username: string;
    readonly email: string;
}
export class User implements IUser {
    constructor(public username: string, public email: string) { }
}