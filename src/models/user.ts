import { Schema, model } from "mongoose";
import { IUser, IUserMethod, UserModel } from '../interfaces/user'
import { hashSync, compareSync } from 'bcrypt'

// User Schema
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

// Hash user password before store to database
UserSchema.pre('save', function(next: any){

    if(this.isModified('password')){
        this.password = hashSync(this.password, 10)
    }

    next()
})

// Schema method to authenticate user via password
UserSchema.method('comparePassword' ,function comparePassword(password) {

    return compareSync(password, this.password)
})

// Export User model
export const User = model<IUser, UserModel>('User', UserSchema)