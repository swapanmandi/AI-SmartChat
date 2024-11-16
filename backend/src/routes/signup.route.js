import {signupUser} from '../controllers/user.controller.js'
import {Router} from 'express'

const router = Router();
router.route('/signup').post(signupUser)


export default router