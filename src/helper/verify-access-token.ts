import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken: any = req.headers['x-access-token']

        if (!accessToken) {
            console.log('[server]: jwt-token-not-found')
            return res.status(401).send({
                error: true,
                message: 'Token not provided.'
            })
        }

        const user = await User.findOne({accessToken})

        if(!user){
            console.error('[server]: jwt-token-not-listed')
            return res.status(401).send({
                error: true,
                message: 'Token not listed in the database.'
            })
        }

        jwt.verify(accessToken, process.env.JWT_SECRET_KEY!, (error: any, decoded: any) => {
            if(error) {
                console.error('[server]: jwt-verify-error', error)
                return res.status(401).send({
                    error: true,
                    message: 'Invalid token provided.'
                })
            }

            req.decoded = decoded
            next()
        })
    } catch (error) {
        console.error('[server]: jwt-error', error)
        return res.status(401).send({
            error: true,
            message: 'Failed to authorize user, please try again.'
        })
    }
}