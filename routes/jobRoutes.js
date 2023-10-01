import { Router } from 'express'
import {
  getAllJobs,
  addJob,
  editJob,
  deleteJob,
} from '../controllers/jobController.js'
import {
  validationIDParam,
  validationJobInput,
  
} from '../middleware/validationMiddleware.js'
import { getStats } from '../controllers/userControllers.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.route('/').get(getAllJobs).post(validationJobInput, authMiddleware,addJob)

router.get('/stats', authMiddleware, getStats)
router
  .route('/:id')
  .patch(validationIDParam, editJob)
  .delete(validationIDParam, deleteJob)

export default router

