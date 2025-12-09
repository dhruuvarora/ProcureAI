import express from 'express'
import rfpController from './rfp.controller'

const router = express.Router()

router.post('/create-rfps', rfpController.createRfp)
router.get('/get-rfps', rfpController.getRfps)
router.get('/get-rfp/:id', rfpController.getRfpById)
router.put("/rfp/:id", rfpController.updateRfp);

export default router