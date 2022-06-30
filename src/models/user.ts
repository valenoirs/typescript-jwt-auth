import { Schema, model } from "mongoose";
import { IUser, IUserMethod, UserModel } from '../interfaces/user'
import { hashSync, compareSync } from 'bcrypt'


const UserSchema: Schema = new Schema<IUser, UserModel, IUserMethod>({
    
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    admin: {type: Boolean, default: false},
    accessToken: {type: String, default: ''},
},
{
    timestamps:true
})

UserSchema.pre('save', function(next: any){

    if(this.isModified('password')){
        this.password = hashSync(this.password, 10)
    }

    next()
})

UserSchema.method('comparePassword' ,function comparePassword(password) {

    return compareSync(password, this.password)
})

export const User = model<IUser, UserModel>('User', UserSchema)