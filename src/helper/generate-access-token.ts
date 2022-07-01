import jwt from 'jsonwebtoken'

/**
 * Generate access token for client that expires in 1 day
 * @param email string - User email address
 * @param admin boolean - User admin role
 * @returns {string}
 */
export const generateToken = (email: string, admin: boolean) => {
    const options = {
        expiresIn: '1d'
    }

    const payload = {email, admin}
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, options)

    return token
}