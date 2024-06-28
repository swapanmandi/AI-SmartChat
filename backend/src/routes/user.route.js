import {Router} from 'express'
import {signupUser} from '../controllers/user.controller.js'
import { loginUser } from '../controllers/user.controller.js';


const router = Router();

router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)

export default router