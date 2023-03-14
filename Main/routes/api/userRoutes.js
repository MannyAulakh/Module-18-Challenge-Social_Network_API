const router = require('express').Router();
const {
  getUsers,
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController');

// /api/students
router.route('/').get(getUsers).post(createUser);

// /api/students/:studentId
router.route('/:userId').get(getOneUser).delete(deleteUser).put(updateUser);

// /api/students/:studentId/assignments
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
