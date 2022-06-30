import jwt from 'jsonwebtoken'

// Generate token function
export const generateToken = async (email: string, admin: boolean) => {
    const options = {
        expiresIn: '1d'
    }

    const payload = {email, admin}
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY!, options)

    return token
}