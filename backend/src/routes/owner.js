const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getOwnerDashboard } = require('../controllers/ownerController');

router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
