// User Controller
import { Request, Response } from "express";

import { generateToken } from "../helper/generate-access-token";

import { User } from '../models/user'
import { IUser } from "../interfaces/user";
import { signInValidation, signUpValidation } from "../helper/user-validation";

// User Sign in controller
export const signIn = async (req: Request, res: Response) => {
    try{
        // Validate user input
        const value: Pick<IUser, 'email'|'password'> = await signInValidation.validateAsync(req.body)

        const {email, password} = value

        const user = await User.findOne({email})

        // If user didn't found
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
        
        // Authenticating user by password
        const authenticated = await user.comparePassword(password)

        // If user unauthorized
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

        // Generate access token for user
        const token: string = await generateToken(user.email, user.admin)

        // Store user access token to database
        user.accessToken = token;
        await user.save()

        // Success response
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
        // Error handler if something went wrong while signing in user
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

// User Sign up controller
export const signUp = async (req: Request, res: Response) => {
    try{
        // Validate user input
        const value: IUser = await signUpValidation.validateAsync(req.body)

        const {email} = value;

        const user = await User.findOne({email})

        // If user already registered
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

        // Saving new user to database
        await new User(value).save()

        // Success response
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
        // Error handler if something went wrong while signing up user
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
        
        // Delete access token from database
        await User.updateOne({email}, {
            $set: {
                accessToken: ''
            }
        })

        // Success response
        console.log(`[server]: ${email}-successfully-signed-out!`)
        return res.status(300).send({
            success:true,
            status: 300,
            data: {
                message: 'See you later.'
            }
        })
    } catch (error) {
        // Error handler if something went wrong while signing out user
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