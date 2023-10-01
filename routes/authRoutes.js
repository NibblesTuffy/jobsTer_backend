import { Router } from 'express'
import { login, logout, register } from '../controllers/authControllers.js'
import {
  validationLoginUser,
  validationRegisterUser,
  validationUserInput,
} from '../middleware/validationMiddleware.js'
import { getCurrentUser, updateUser } from '../controllers/userControllers.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', validationRegisterUser, register)
router.post('/login', validationLoginUser, login)

router.get('/logout', logout)


router.get('/currentUser', authMiddleware, getCurrentUser)
router.patch('/updateUser', authMiddleware, validationUserInput, updateUser)
export default router
