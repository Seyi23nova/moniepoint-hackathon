import express from 'express'
import { uploadFile } from '../controllers/uploadFile'

const router = express.Router()

router.post('/uploadFile', uploadFile)

export default router