import { Router } from 'express'
import runner from './controllers/runner'

const routes = Router()
  .get('/', (_, res) => res.send('Hello world!'))
  .post('/runner/:language', runner.run)

export default routes
