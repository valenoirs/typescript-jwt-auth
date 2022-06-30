import { Request, Response } from "express";

import { generateToken } from "../helper/generate-access-token";

import { User } from '../models/user'
import { IUser } from "../interfaces/user";
import { signInValidation, signUpValidation } from "../helper/user-validation";


export const signIn = async (req: Request, res: Response) => {
    try{
        const value: Pick<IUser, 'email'|'password'> = await signInValidation.validateAsync(req.body)

        const {email, password} = value

        const user = await User.findOne({email})

        if(!user) {
            console.log('[server]: email-not-registered')
            return res.status(401).send({
                error: true,
                message: 'Email not registered.'
            })
        }

        const authenticated = await user.comparePassword(password)

        if(!authenticated){
            console.log('[server]: Invalid user credential provided')
            return res.status(401).send({
                error: true,
                message: 'Invalid credential, please try again.'
            })
        }

        const token: string = await generateToken(user.email, user.admin)

        user.accessToken = token;

        await user.save()

        console.log(`[server]: ${user.email} signed in!`)
        return res.status(300).send({
            success:true,
            error:false,
            token
        })
    }
    catch(error){
        console.error('sign-in-error', error)
        return res.status(500).send({
            error:true,
            message: error
        })
    }
}

export const signUp = async (req: Request, res: Response) => {
    try{
        const value: IUser = await signUpValidation.validateAsync(req.body)

        const {email} = value;

        const user = await User.findOne({email})

        if(user){
            console.log('[server]: email-already-registered')
            return res.status(401).send({
                error: true,
                message: 'Email already registered.'
            })
        }

        await new User(value).save()

        console.log(`[server]: ${value.email} signed up!`)
        return res.status(300).send({
            success:true,
            error:false,
            message: 'User successfully signed up.'
        })
    }
    catch(error){
        console.error('sign-up-error', error)
        return res.status(500).send({
            error:true,
            message: error
        })
    }
}

export const signOut = async (req: Request, res: Response) => {
    try {
        const {email} = req.decoded
        
        await User.updateOne({email}, {
            $set: {
                accessToken: ''
            }
        })

        console.log('[server]: User successfully signed out!')
        return res.status(300).send({
            success: true,
            error: false,
            message: 'User successfully signed out.'
        })
    } catch (error) {
        console.log('[server]: User sign out error!')
        return res.status(500).send({
            error: true,
            message: error
        })
    }
}