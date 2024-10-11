import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/app'
import { inject } from '@vercel/analytics'

inject()

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App  />)
