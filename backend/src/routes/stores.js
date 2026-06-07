const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getStores, submitRating } = require('../controllers/storeController');
const { ratingValidation } = require('../middleware/validators');

router.use(authenticate, authorize('user'));

router.get('/', getStores);
router.post('/:id/rate', ratingValidation, submitRating);

module.exports = router;
