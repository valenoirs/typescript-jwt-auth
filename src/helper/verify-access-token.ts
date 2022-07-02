import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import config from '../config/config'

/**
 * Verify Access Token middleware return HTTP Response if error, else call express next() function
 * @param req Express HTTP request
 * @param res Express HTTP response
 * @param next Express next()
 * @returns
 */
export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting Access Token from headers
        const accessToken: any = req.headers['x-access-token']

        // If access token not provided
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

        // Find user based on access token
        const user = await User.findOne({accessToken})

        // If access token not found in the database
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

        // Verify the token using the secret
        jwt.verify(accessToken, config.jwtSecret, (error: any, decoded: any) => {
            // Error handler if validation failed
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

            // Send the decoded jwt to next middleware
            req.decoded = decoded
            next()
        })
    } catch (error) {
        // Error handler if something went wrong about the access token
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