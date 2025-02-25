const express = require('express');
const router = express.Router();
import * as userController from '../controllers/userController';
import { userValidator } from '../validator/userValidator';

//crud
router.get('', userController.loggedUser);
router.put('', userValidator, userController.updateUser);
router.delete('', userController.deleteUser);

// router.get('/teste-user', userController.createTesteUser);

export default router;
