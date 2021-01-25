import { exec } from 'child_process'
import path from 'path'
import express from 'express'

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000
const HOST = '0.0.0.0'
const CHILD_PROCESS_TIMEOUT_MS = 5000

const app = express()

app.get('/', (_, res) => {
  res.send('Hello World')
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})

const filePath = path.join(__dirname, '..', 'tmp', 'test.py')

// python3 -c "code string withou break line"
const childProcess = exec(
  `python3 ${filePath}`,
  { timeout: CHILD_PROCESS_TIMEOUT_MS }, // process is killed if time out
  (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout`)
    console.log(stdout)
  }
)
