// User Router
import express from 'express'
import { signIn, signUp, signOut } from '../controllers/user'
import { verifyAccessToken } from '../helper/verify-access-token'

export const router = express.Router()

router.route('/signin').post(signIn)

router.route('/signup').post(signUp)

router.route('/signout').get(verifyAccessToken, signOut)