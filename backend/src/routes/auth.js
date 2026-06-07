const router = require('express').Router();
const { register, login, updatePassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation, updatePasswordValidation } = require('../middleware/validators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/update-password', authenticate, updatePasswordValidation, updatePassword);

module.exports = router;
