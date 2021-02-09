import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import { port } from './settings'

const app = express()

// middlewares
app.use(helmet()) // garante segurança
app.use(cors()) // permite requisição de todos cors
app.use(express.json())
app.use(routes)

app.listen(port, () => console.log(`Running on http://localhost:${port}`))