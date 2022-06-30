// Create interface module for user model
import { Model } from "mongoose"

// User Schema interface
export interface IUser {
    username: string,
    email: string,
    password: string,
    admin: boolean,
    accessToken?: string
}

// User Schema method interface
export interface IUserMethod {
    comparePassword(password: string): boolean
}

// User model type
export type UserModel = Model<IUser, {}, IUserMethod>