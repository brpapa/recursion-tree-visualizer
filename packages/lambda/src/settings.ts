require('dotenv').config()

const environment = String(process.env.NODE_ENV) || 'production'

export { environment }
