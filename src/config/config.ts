import 'dotenv/config.js'

type port = string | undefined
type mongoUri = string
type jwtSecret = string

interface IConfig {
    port: port,
    mongoUri: mongoUri,
    jwtSecret: jwtSecret
}

const port: port = process.env.PORT
const mongoUri: mongoUri = process.env.MONGO_URI!
const jwtSecret: jwtSecret = process.env.JWT_SECRET_KEY!

const config: IConfig = {
    port,
    mongoUri,
    jwtSecret
}

export default config