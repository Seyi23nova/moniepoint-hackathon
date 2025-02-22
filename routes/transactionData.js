import express from 'express'
import {highestSalesVolume, highestSalesValue, mostSoldProductID, highestSalesStaffID, highestHourOfDay} from '../controllers/transactionMetrics'

const router = express.Router()

router.get('/highestSalesVolume', highestSalesVolume)
router.get('/highestSalesValue', highestSalesValue)
router.get('/mostSoldProductID', mostSoldProductID)
router.get('/highestSalesStaffID', highestSalesStaffID)
router.get('/highestHourOfDay', highestHourOfDay)


export default router