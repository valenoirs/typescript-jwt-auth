import 'dotenv/config.js'

type port = string | undefined
type mongoUri = string

interface IConfig {
    port: port,
    mongoUri: mongoUri
}

const port: port = process.env.PORT
const mongoUri: mongoUri = process.env.MONGO_URI!

const config: IConfig = {
    port,
    mongoUri
}

export default config