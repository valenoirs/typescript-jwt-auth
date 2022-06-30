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
            console.log('[server]: email-not-registered-in-the-database')
            return res.status(401).send({
                error: true,
                status: 401,
                type: 'SignInError',
                data: {
                    message: 'User with corresponding email not found.'
                }
            })
        }
        
        const authenticated = await user.comparePassword(password)

        if(!authenticated){
            console.log('[server]: invalid-user-credential-provided-by-the-client')
            return res.status(401).send({
                error: true,
                status: 401,
                type: 'SignInError',
                data: {
                    message: 'Invalid credential provided.'
                }
            })
        }

        const token: string = await generateToken(user.email, user.admin)

        user.accessToken = token;

        await user.save()

        console.log(`[server]: ${user.email}-signed-in!`)
        return res.status(300).send({
            success:true,
            status: 300,
            data: {
                message: 'Successfully signed up',
                username: user.username,
                email,
                token
            }
        })
    }
    catch(error){
        console.error('sign-in-error', error)
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'SignInError',
            data: {
                message: 'Something went wrong while trying to sign in, please try again.'
            }
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
                status: 401,
                type: 'SignUpError',
                data: {
                    message: 'User with corresponding email already registered.'
                }
            })
        }

        await new User(value).save()

        console.log(`[server]: ${value.email}-signed-up!`)
        return res.status(300).send({
            success:true,
            status: 300,
            data: {
                message: 'Successfully signed up, please login to continue.',
            }
        })
    }
    catch(error){
        console.error('sign-up-error', error)
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'SignUpError',
            data: {
                message: 'Something went wrong while trying to sign up, please try again.'
            }
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

        console.log(`[server]: ${email}-successfully-signed-out!`)
        return res.status(300).send({
            success:true,
            status: 300,
            data: {
                message: 'See you later.'
            }
        })
    } catch (error) {
        console.log('[server]: User sign out error!')
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'SignOutError',
            data: {
                message: 'Something went wrong while trying to sign out, please try again.'
            }
        })
    }
}