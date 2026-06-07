const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { validationResult } = require('express-validator');

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowedSort = ['name', 'address', 'createdAt'];
    const order = [[allowedSort.includes(sortBy) ? sortBy : 'name', sortOrder === 'DESC' ? 'DESC' : 'ASC']];

    const stores = await Store.findAll({
      where,
      order,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'userId'] }],
    });

    const result = stores.map((s) => {
      const store = s.toJSON();
      const ratings = store.ratings || [];
      const userRating = ratings.find((r) => r.userId === req.user.id);

      store.averageRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : null;
      store.totalRatings = ratings.length;
      store.userRating = userRating ? userRating.rating : null;
      delete store.ratings;
      return store;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const storeId = parseInt(req.params.id);
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { rating },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.json({ message: created ? 'Rating submitted' : 'Rating updated', rating: ratingRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, submitRating };
