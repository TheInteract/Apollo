import express from 'express'

const routers = express.Router()

routers.get('/healthz', (req, res) => res.sendStatus(200))

export default routers
