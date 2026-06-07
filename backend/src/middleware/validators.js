const { body } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const registerValidation = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password must be 8-16 chars, include uppercase and special character'),
  body('address').trim().isLength({ max: 400 }).withMessage('Address max 400 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .matches(passwordRegex)
    .withMessage('New password must be 8-16 chars, include uppercase and special character'),
];

const createUserValidation = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password must be 8-16 chars, include uppercase and special character'),
  body('address').trim().isLength({ max: 400 }).withMessage('Address max 400 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Invalid role'),
];

const createStoreValidation = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Store name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('address').trim().isLength({ max: 400 }).withMessage('Address max 400 characters'),
];

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  createUserValidation,
  createStoreValidation,
  ratingValidation,
};
