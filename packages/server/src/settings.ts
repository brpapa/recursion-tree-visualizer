require('dotenv').config()

const port = (process.env.PORT && parseInt(process.env.PORT)) || 3030
const environment = String(process.env.NODE_ENV) || 'production'

export {
  port,
  environment
}
