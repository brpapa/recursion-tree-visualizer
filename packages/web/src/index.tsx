import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
import { inject } from '@vercel/analytics'

inject()

render(<App />, document.getElementById('root'))
