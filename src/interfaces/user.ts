import { Model } from "mongoose"

export interface IUser {
    username: string,
    email: string,
    password: string,
    admin: boolean,
    accessToken?: string
}

export interface IUserMethod {
    comparePassword(password: string): boolean
}

export type UserModel = Model<IUser, {}, IUserMethod>