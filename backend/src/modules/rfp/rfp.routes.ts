import express from 'express'
import rfpController from './rfp.controller'

const router = express.Router()

router.post('/rfps', rfpController.createRfp)

export default router