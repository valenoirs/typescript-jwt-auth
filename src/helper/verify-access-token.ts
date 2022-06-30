import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken: any = req.headers['x-access-token']

        if (!accessToken) {
            console.log('[server]: access-token-not-provided')
            return res.status(401).send({
                error: true,
                status: 401,
                type: 'AccessTokenError',
                data: {
                    message: 'Access token not provided by the client.'
                }
            })
        }

        const user = await User.findOne({accessToken})

        if(!user){
            console.error('[server]: access-token-invalid')
            return res.status(401).send({
                error: true,
                status: 401,
                type: 'AccessTokenError',
                data: {
                    message: 'Access token porvided was invalid.'
                }
            })
        }

        jwt.verify(accessToken, process.env.JWT_SECRET_KEY!, (error: any, decoded: any) => {
            if(error) {
                console.error('[server]: jwt-verify-error', error)
                return res.status(401).send({
                    error: true,
                    status: 401,
                    type: 'AccessTokenError',
                    data: {
                        message: 'Access token provided by the client is invalid.'
                    }
                })
            }

            req.decoded = decoded
            next()
        })
    } catch (error) {
        console.error('[server]: access-token-error', error)
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'AccessTokenError',
            data: {
                message: 'Something went wrong while verifying access token, please try again.'
            }
        })
    }
}