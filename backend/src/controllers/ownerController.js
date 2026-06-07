const { Store, Rating, User } = require('../models');

const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];

    storeData.averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : null;
    storeData.totalRatings = ratings.length;

    res.json(storeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOwnerDashboard };
